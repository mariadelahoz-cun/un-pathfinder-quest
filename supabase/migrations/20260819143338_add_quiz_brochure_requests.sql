CREATE TABLE public.quiz_brochure_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  email text NOT NULL
);
GRANT INSERT ON public.quiz_brochure_requests TO anon, authenticated;
GRANT SELECT ON public.quiz_brochure_requests TO authenticated;
GRANT ALL ON public.quiz_brochure_requests TO service_role;
ALTER TABLE public.quiz_brochure_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can request a brochure" ON public.quiz_brochure_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read brochure requests" ON public.quiz_brochure_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
