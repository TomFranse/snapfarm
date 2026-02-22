-- Invert pest delta (delta_r) sign convention:
-- + = invites pests (bad), - = protects against pests (good)
UPDATE public.plants
SET effects = effects || jsonb_build_object('delta_r', -(COALESCE((effects->>'delta_r')::numeric, 0)))
WHERE effects->>'delta_r' IS NOT NULL AND effects->>'delta_r' != '0';
