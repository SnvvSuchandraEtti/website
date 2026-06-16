
CREATE TABLE public.site_stats (
  key TEXT PRIMARY KEY,
  count BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_stats TO anon, authenticated;
GRANT ALL ON public.site_stats TO service_role;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site stats" ON public.site_stats FOR SELECT USING (true);

CREATE TABLE public.app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.app_config TO service_role;
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;
-- No policies for anon/authenticated: only service_role (edge functions) reads/writes.

CREATE OR REPLACE FUNCTION public.increment_visitor()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE new_count BIGINT;
BEGIN
  INSERT INTO public.site_stats(key, count)
  VALUES ('visitor_count', 1)
  ON CONFLICT (key) DO UPDATE
    SET count = public.site_stats.count + 1,
        updated_at = now()
  RETURNING count INTO new_count;
  RETURN new_count;
END;
$$;
GRANT EXECUTE ON FUNCTION public.increment_visitor() TO anon, authenticated;
