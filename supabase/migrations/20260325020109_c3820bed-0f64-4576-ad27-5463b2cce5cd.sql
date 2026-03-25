-- Fix chat_conversations RLS: restrict to service_role only
DROP POLICY IF EXISTS "Service role only - insert chat messages" ON public.chat_conversations;
DROP POLICY IF EXISTS "Service role only - read chat messages" ON public.chat_conversations;

CREATE POLICY "Service role only - insert chat messages"
ON public.chat_conversations
FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role only - read chat messages"
ON public.chat_conversations
FOR SELECT
TO service_role
USING (true);