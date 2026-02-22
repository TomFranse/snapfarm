-- Invert wind delta (delta_w) sign convention:
-- + = doesn't protect against wind (bad), - = protects against wind (good)
UPDATE public.plants
SET effects = jsonb_set(effects, '{delta_w}', to_jsonb((-1) * (effects->>'delta_w')::numeric))
WHERE effects ? 'delta_w';
