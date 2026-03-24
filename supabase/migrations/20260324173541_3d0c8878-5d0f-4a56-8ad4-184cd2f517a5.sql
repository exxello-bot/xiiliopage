
CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  event_type text NOT NULL,
  event_name text NOT NULL,
  page_path text,
  referrer text,
  user_agent text,
  properties jsonb DEFAULT '{}'::jsonb,
  session_id text
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only - insert analytics"
ON public.analytics_events FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role only - read analytics"
ON public.analytics_events FOR SELECT
TO service_role
USING (true);

CREATE INDEX idx_analytics_events_type ON public.analytics_events (event_type);
CREATE INDEX idx_analytics_events_created ON public.analytics_events (created_at);
