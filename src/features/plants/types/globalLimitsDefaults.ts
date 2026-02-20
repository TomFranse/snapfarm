import type { GlobalLimits } from "./plants.types";

/** Default global limits – single source of truth in app code */
export const DEFAULT_GLOBAL_LIMITS: GlobalLimits = {
  idx: 0,
  id: "default",
  t_min: "-50",
  t_max: "50",
  l_min: "0",
  l_max: "12",
  f_min: "0",
  f_max: "100",
  p_min: "0",
  p_max: "100",
  m_min: "0",
  m_max: "100",
  a_min: "3.5",
  a_max: "9.5",
};
