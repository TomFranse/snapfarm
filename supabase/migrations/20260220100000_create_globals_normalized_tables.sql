-- Normalized globals schema (replaces single globals JSONB table)
-- environment: 1 row, typed columns
CREATE TABLE IF NOT EXISTS public.environment (
  id TEXT PRIMARY KEY DEFAULT 'default',
  base_temperature NUMERIC NOT NULL DEFAULT 15,
  porosity NUMERIC NOT NULL DEFAULT 0.5,
  acidity NUMERIC NOT NULL DEFAULT 0.5,
  moisture NUMERIC NOT NULL DEFAULT 0.5,
  decay_to_fertility_multiplier NUMERIC NOT NULL DEFAULT 0.01,
  light NUMERIC NOT NULL DEFAULT 0.5,
  fertility NUMERIC NOT NULL DEFAULT 0.5
);

-- global_limits: 1 row, typed columns
CREATE TABLE IF NOT EXISTS public.global_limits (
  id TEXT PRIMARY KEY DEFAULT 'default',
  t_min NUMERIC NOT NULL,
  t_max NUMERIC NOT NULL,
  l_min NUMERIC NOT NULL,
  l_max NUMERIC NOT NULL,
  f_min NUMERIC NOT NULL,
  f_max NUMERIC NOT NULL,
  p_min NUMERIC NOT NULL,
  p_max NUMERIC NOT NULL,
  m_min NUMERIC NOT NULL,
  m_max NUMERIC NOT NULL,
  a_min NUMERIC NOT NULL,
  a_max NUMERIC NOT NULL
);

-- items: 1 row per item, typed columns + effects JSONB
CREATE TABLE IF NOT EXISTS public.items (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  color_key TEXT,
  kind TEXT NOT NULL DEFAULT 'item',
  effects JSONB NOT NULL DEFAULT '[]'
);

-- plants: wide table, 1 row per plant
CREATE TABLE IF NOT EXISTS public.plants (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'plant',
  status TEXT,
  description TEXT,
  price NUMERIC DEFAULT 0,
  -- F (fertility)
  f_max NUMERIC,
  f_min NUMERIC,
  f_opt NUMERIC,
  fy_max NUMERIC,
  fy_min NUMERIC,
  fyield NUMERIC,
  -- L (light)
  l_max NUMERIC,
  l_min NUMERIC,
  l_opt NUMERIC,
  ly_max NUMERIC,
  ly_min NUMERIC,
  -- M (moisture)
  m_max NUMERIC,
  m_min NUMERIC,
  m_opt NUMERIC,
  my_max NUMERIC,
  my_min NUMERIC,
  -- P (porosity)
  p_max NUMERIC,
  p_min NUMERIC,
  p_opt NUMERIC,
  py_max NUMERIC,
  py_min NUMERIC,
  -- T (temperature)
  t_max NUMERIC,
  t_min NUMERIC,
  t_opt NUMERIC,
  ty_max NUMERIC,
  ty_min NUMERIC,
  tf_max NUMERIC,
  tf_min NUMERIC,
  -- A (acidity/pH)
  a_max NUMERIC,
  a_min NUMERIC,
  a_opt NUMERIC,
  ay_max NUMERIC,
  ay_min NUMERIC,
  -- timing (ms)
  establish_ms BIGINT,
  flowering_ms BIGINT,
  rest_ms BIGINT,
  yield_ms BIGINT,
  lifespan_ms BIGINT,
  -- rates and thresholds
  decomposition_rate_per_day_grams NUMERIC,
  nutrient_uptake_rate NUMERIC,
  max_growth_per_day_grams NUMERIC,
  damage_multiplier NUMERIC,
  rest_exit_threshold NUMERIC,
  yield_repeats INTEGER,
  -- leaf/root
  leaf_diameter_tiles_per_gram NUMERIC,
  leaf_grams_per_tile_diameter NUMERIC,
  leaf_shadow_density_domain NUMERIC,
  root_grams_per_tile_diameter NUMERIC,
  root_diameter_tiles_per_gram NUMERIC,
  root_uptake_per_day_domain NUMERIC,
  -- optional
  plant_color_key TEXT,
  grams_per_percent_fertility NUMERIC,
  fruit_weight_g NUMERIC,
  fruit_weight_grams NUMERIC,
  reproduction_enabled BOOLEAN,
  spread_distance_tiles INTEGER,
  yield_visual_asset_id TEXT,
  -- JSONB for variable/complex
  environment_effects JSONB DEFAULT '[]',
  yield_svg_data TEXT
);

-- definition_versions: 1 row, versions as JSONB
CREATE TABLE IF NOT EXISTS public.definition_versions (
  id TEXT PRIMARY KEY DEFAULT 'plant-definitions-meta',
  versions JSONB NOT NULL DEFAULT '{}'
);

-- RLS: public read for all (game config)
ALTER TABLE public.environment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.definition_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read environment" ON public.environment FOR SELECT USING (true);
CREATE POLICY "Public read global_limits" ON public.global_limits FOR SELECT USING (true);
CREATE POLICY "Public read items" ON public.items FOR SELECT USING (true);
CREATE POLICY "Public read plants" ON public.plants FOR SELECT USING (true);
CREATE POLICY "Public read definition_versions" ON public.definition_versions FOR SELECT USING (true);
