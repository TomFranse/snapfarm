-- Set global_limits to average soil and climate for C climate (temperate) NW Europe
-- Populate w_opt and r_opt for all plants (50 = average)

UPDATE public.global_limits
SET
  t_min = -5,
  t_max = 28,
  l_min = 6,
  l_max = 14,
  f_min = 25,
  f_max = 90,
  p_min = 30,
  p_max = 75,
  m_min = 50,
  m_max = 100,
  a_min = 5.5,
  a_max = 7.5,
  s_min = 25,
  s_max = 85,
  w_min = 0,
  w_max = 100,
  r_min = 0,
  r_max = 100
WHERE id = 'default';

UPDATE public.plants
SET w_opt = 50, r_opt = 50
WHERE w_opt IS NULL OR r_opt IS NULL;
