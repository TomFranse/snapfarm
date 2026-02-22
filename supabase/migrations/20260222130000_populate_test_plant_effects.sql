-- Fill test-plant effects (was empty); use 0 for all deltas
UPDATE public.plants
SET effects = '{"delta_t":0,"delta_l":0,"delta_f":0,"delta_p":0,"delta_m":0,"delta_a":0,"delta_w":0,"delta_r":0}'::jsonb
WHERE id = 'test-plant' AND (effects = '{}'::jsonb OR effects IS NULL);
