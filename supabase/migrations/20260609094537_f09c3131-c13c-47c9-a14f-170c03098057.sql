CREATE TABLE IF NOT EXISTS public.project_summaries (
  project_id text PRIMARY KEY,
  summary text NOT NULL,
  model text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.project_summaries TO anon, authenticated;
GRANT ALL ON public.project_summaries TO service_role;

ALTER TABLE public.project_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read project summaries"
  ON public.project_summaries FOR SELECT
  TO anon, authenticated
  USING (true);