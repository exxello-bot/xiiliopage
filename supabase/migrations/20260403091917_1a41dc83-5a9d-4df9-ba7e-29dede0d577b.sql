INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public read access on documents" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'documents');