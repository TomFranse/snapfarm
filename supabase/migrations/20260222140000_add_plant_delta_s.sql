-- Add delta_s (soil effect) to plant effects
-- Scale: 0-100; positive = improves soil for others, negative = depletes

UPDATE public.plants SET effects = effects || '{"delta_s":-20}'::jsonb WHERE id = 'cannabis-sativa';
UPDATE public.plants SET effects = effects || '{"delta_s":20}'::jsonb WHERE id = 'Chestnut';
UPDATE public.plants SET effects = effects || '{"delta_s":40}'::jsonb WHERE id = 'comfrey';
UPDATE public.plants SET effects = effects || '{"delta_s":10}'::jsonb WHERE id = 'Garlic';
UPDATE public.plants SET effects = effects || '{"delta_s":30}'::jsonb WHERE id = 'Goumi';
UPDATE public.plants SET effects = effects || '{"delta_s":8}'::jsonb WHERE id = 'Hardy Kiwi';
UPDATE public.plants SET effects = effects || '{"delta_s":10}'::jsonb WHERE id = 'Mulberry';
UPDATE public.plants SET effects = effects || '{"delta_s":-10}'::jsonb WHERE id = 'Strawberry';
UPDATE public.plants SET effects = effects || '{"delta_s":-20}'::jsonb WHERE id = 'tomato';
UPDATE public.plants SET effects = effects || '{"delta_s":0}'::jsonb WHERE id = 'test-plant';
