import type { GlobalLimits } from "./plants.types";

/**
 * Default global limits – average soil and climate for C climate (temperate) NW Europe.
 * Single source of truth in app code.
 */
export const DEFAULT_GLOBAL_LIMITS: GlobalLimits = {
  idx: 0,
  id: "default",
  t_min: "-5",
  t_max: "28",
  l_min: "6",
  l_max: "14",
  f_min: "25",
  f_max: "90",
  p_min: "30",
  p_max: "75",
  m_min: "50",
  m_max: "100",
  a_min: "5.5",
  a_max: "7.5",
  s_min: "25",
  s_max: "85",
  w_min: "0",
  w_max: "100",
  r_min: "0",
  r_max: "100",
};
