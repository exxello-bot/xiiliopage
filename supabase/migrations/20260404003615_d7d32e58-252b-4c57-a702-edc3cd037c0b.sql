
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Create customer_messages table
CREATE TABLE public.customer_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.contact_submissions(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('customer', 'admin')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.customer_messages ENABLE ROW LEVEL SECURITY;

-- Customers can read messages on their own submissions (matched by email)
CREATE POLICY "Customers can read own messages"
ON public.customer_messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.contact_submissions cs
    JOIN public.profiles p ON p.user_id = auth.uid()
    WHERE cs.id = submission_id
    AND cs.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
  OR public.has_role(auth.uid(), 'admin')
);

-- Customers can insert messages on their own submissions
CREATE POLICY "Customers can send messages on own submissions"
ON public.customer_messages FOR INSERT
TO authenticated
WITH CHECK (
  (
    sender_role = 'customer'
    AND EXISTS (
      SELECT 1 FROM public.contact_submissions cs
      WHERE cs.id = submission_id
      AND cs.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  )
  OR (
    sender_role = 'admin'
    AND public.has_role(auth.uid(), 'admin')
  )
);

-- Admins can read all messages
CREATE POLICY "Admins can read all messages"
ON public.customer_messages FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow customers to read their own contact submissions
CREATE POLICY "Customers can read own submissions"
ON public.contact_submissions FOR SELECT
TO authenticated
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Enable realtime for customer_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.customer_messages;

-- Trigger for updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
