
CREATE OR REPLACE FUNCTION public.auto_score_lead()
RETURNS TRIGGER AS $$
DECLARE
  _score integer := 0;
  _domain text;
  _msg_lower text;
  _keyword_count integer := 0;
BEGIN
  _msg_lower := lower(NEW.message);
  _domain := split_part(NEW.email, '@', 2);

  -- Company provided: +20
  IF NEW.company IS NOT NULL AND trim(NEW.company) <> '' THEN
    _score := _score + 20;
  END IF;

  -- Message length scoring
  IF length(NEW.message) >= 300 THEN
    _score := _score + 30;
  ELSIF length(NEW.message) >= 150 THEN
    _score := _score + 20;
  ELSIF length(NEW.message) >= 50 THEN
    _score := _score + 10;
  END IF;

  -- Business email (not free providers): +25
  IF _domain NOT IN ('gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com', 'mail.com', 'protonmail.com', 'yandex.com') THEN
    _score := _score + 25;
  END IF;

  -- Email domain matches company name: +15
  IF NEW.company IS NOT NULL AND trim(NEW.company) <> '' THEN
    IF position(lower(split_part(_domain, '.', 1)) in lower(NEW.company)) > 0
       OR position(lower(replace(NEW.company, ' ', '')) in _domain) > 0 THEN
      _score := _score + 15;
    END IF;
  END IF;

  -- Keyword matching (max 2 keywords, +10 each)
  IF _msg_lower LIKE '%budget%' THEN _keyword_count := _keyword_count + 1; END IF;
  IF _msg_lower LIKE '%timeline%' THEN _keyword_count := _keyword_count + 1; END IF;
  IF _keyword_count < 2 AND _msg_lower LIKE '%project%' THEN _keyword_count := _keyword_count + 1; END IF;
  IF _keyword_count < 2 AND _msg_lower LIKE '%hire%' THEN _keyword_count := _keyword_count + 1; END IF;
  IF _keyword_count < 2 AND _msg_lower LIKE '%agency%' THEN _keyword_count := _keyword_count + 1; END IF;
  IF _keyword_count < 2 AND _msg_lower LIKE '%contract%' THEN _keyword_count := _keyword_count + 1; END IF;
  IF _keyword_count < 2 AND _msg_lower LIKE '%deadline%' THEN _keyword_count := _keyword_count + 1; END IF;
  _score := _score + (_keyword_count * 10);

  -- Cap at 100
  NEW.score := LEAST(_score, 100);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Only on INSERT so manual edits are preserved
CREATE TRIGGER trg_auto_score_lead
BEFORE INSERT ON public.contact_submissions
FOR EACH ROW
EXECUTE FUNCTION public.auto_score_lead();
