-- Add effects JSONB column: effects plants have on their surroundings (ΔT, ΔL, ΔF, ΔP, ΔM, ΔA, ΔW, ΔR)
-- Separate from environment_effects which is used by another app

ALTER TABLE public.plants
  ADD COLUMN IF NOT EXISTS effects JSONB DEFAULT '{}';

UPDATE public.plants SET effects = '{"delta_t":-2,"delta_l":-12,"delta_f":-8,"delta_p":2,"delta_m":-6,"delta_a":-0.2,"delta_w":1,"delta_r":-2}'::jsonb WHERE id = 'cannabis-sativa';
UPDATE public.plants SET effects = '{"delta_t":-6,"delta_l":-15,"delta_f":-4,"delta_p":4,"delta_m":-5,"delta_a":-0.3,"delta_w":8,"delta_r":-2}'::jsonb WHERE id = 'Chestnut';
UPDATE public.plants SET effects = '{"delta_t":-3,"delta_l":-6,"delta_f":4,"delta_p":7,"delta_m":3,"delta_a":0.1,"delta_w":2,"delta_r":6}'::jsonb WHERE id = 'comfrey';
UPDATE public.plants SET effects = '{"delta_t":0,"delta_l":-1,"delta_f":-3,"delta_p":1,"delta_m":-2,"delta_a":0,"delta_w":0,"delta_r":9}'::jsonb WHERE id = 'Garlic';
UPDATE public.plants SET effects = '{"delta_t":-3,"delta_l":-8,"delta_f":9,"delta_p":3,"delta_m":-3,"delta_a":0.2,"delta_w":6,"delta_r":5}'::jsonb WHERE id = 'Goumi';
UPDATE public.plants SET effects = '{"delta_t":-4,"delta_l":-14,"delta_f":-6,"delta_p":2,"delta_m":-8,"delta_a":-0.1,"delta_w":3,"delta_r":1}'::jsonb WHERE id = 'Hardy Kiwi';
UPDATE public.plants SET effects = '{"delta_t":-5,"delta_l":-15,"delta_f":1,"delta_p":5,"delta_m":-5,"delta_a":-0.1,"delta_w":7,"delta_r":2}'::jsonb WHERE id = 'Mulberry';
UPDATE public.plants SET effects = '{"delta_t":-1,"delta_l":-1,"delta_f":-5,"delta_p":-1,"delta_m":-5,"delta_a":-0.1,"delta_w":0,"delta_r":-7}'::jsonb WHERE id = 'Strawberry';
UPDATE public.plants SET effects = '{"delta_t":-2,"delta_l":-7,"delta_f":-9,"delta_p":2,"delta_m":-7,"delta_a":-0.3,"delta_w":-1,"delta_r":-6}'::jsonb WHERE id = 'tomato';
