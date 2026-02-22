-- Add s_opt (soil), w_opt (wind resistance), r_opt (pest resistance) to plants
-- s_opt: initially populated from avg(p_opt, f_opt, normalized a_opt); editable thereafter
-- w_opt, r_opt: 0-100 scale, null until populated

ALTER TABLE public.plants
  ADD COLUMN IF NOT EXISTS s_opt NUMERIC,
  ADD COLUMN IF NOT EXISTS w_opt NUMERIC,
  ADD COLUMN IF NOT EXISTS r_opt NUMERIC;

-- Initial population: s_opt = (p_opt + f_opt + (a_opt-3.5)/6*100) / 3
-- Only where all three (p_opt, f_opt, a_opt) are non-null
UPDATE public.plants
SET s_opt = ROUND(((p_opt + f_opt + ((a_opt - 3.5) / 6.0 * 100)) / 3.0)::numeric, 2)
WHERE p_opt IS NOT NULL AND f_opt IS NOT NULL AND a_opt IS NOT NULL;

-- Add s, w, r min/max to global_limits (0-100 defaults)
ALTER TABLE public.global_limits
  ADD COLUMN IF NOT EXISTS s_min NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS s_max NUMERIC NOT NULL DEFAULT 100,
  ADD COLUMN IF NOT EXISTS w_min NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS w_max NUMERIC NOT NULL DEFAULT 100,
  ADD COLUMN IF NOT EXISTS r_min NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS r_max NUMERIC NOT NULL DEFAULT 100;
