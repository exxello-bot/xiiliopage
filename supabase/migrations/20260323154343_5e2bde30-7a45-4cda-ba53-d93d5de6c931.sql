CREATE TABLE public.chat_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_conversations_session ON public.chat_conversations(session_id);
CREATE INDEX idx_chat_conversations_created ON public.chat_conversations(created_at DESC);

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert chat messages"
ON public.chat_conversations
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Anyone can read chat messages"
ON public.chat_conversations
FOR SELECT
TO anon
USING (true);