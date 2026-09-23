-- Tabla única de estudiantes: una fila por persona que cubre todo su
-- recorrido (interés inicial en el brochure -> resultado del reto ->
-- datos de contacto completos), en vez de tres tablas separadas.
-- `stage` indica hasta dónde llegó: 'brochure' (solo dio nombre/correo al
-- inicio), 'result' (ya tiene resultado del reto) o 'lead' (dejó
-- teléfono/ciudad para que un asesor lo contacte).
CREATE TABLE public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  city text,

  top_program_id text,
  top_program_name text,
  top_score integer,
  second_program_id text,
  second_program_name text,
  second_score integer,
  traits jsonb NOT NULL DEFAULT '{}'::jsonb,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,

  stage text NOT NULL DEFAULT 'brochure' CHECK (stage IN ('brochure', 'result', 'lead'))
);

GRANT INSERT, UPDATE ON public.students TO anon, authenticated;
GRANT SELECT ON public.students TO authenticated;
GRANT ALL ON public.students TO service_role;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- El reto no tiene usuarios autenticados: cada visitante crea su propia
-- fila (id generado en el cliente) y la va completando a medida que
-- avanza. El id es un uuid aleatorio, no adivinable.
CREATE POLICY "Anyone can create a student row" ON public.students
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update a student row" ON public.students
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can read students" ON public.students
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER students_set_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
