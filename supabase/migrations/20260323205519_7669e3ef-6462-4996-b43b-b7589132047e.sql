
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  company text DEFAULT '',
  message text NOT NULL
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only - insert contact submissions"
ON public.contact_submissions
FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role only - read contact submissions"
ON public.contact_submissions
FOR SELECT
TO service_role
USING (true);
