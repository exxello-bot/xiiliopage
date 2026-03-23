DROP POLICY IF EXISTS "Anyone can read chat messages" ON public.chat_conversations;
DROP POLICY IF EXISTS "Anyone can insert chat messages" ON public.chat_conversations;

CREATE POLICY "Service role only - read chat messages"
ON public.chat_conversations
FOR SELECT
TO authenticated, service_role
USING (true);

CREATE POLICY "Service role only - insert chat messages"
ON public.chat_conversations
FOR INSERT
TO authenticated, service_role
WITH CHECK (true);