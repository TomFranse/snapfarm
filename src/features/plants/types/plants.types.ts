/**
 * Global min/max limits for environment parameters (T, L, F, P, M, A, S, W, R).
 * Stored as strings for form editing; defaults live in app code, overrides in localStorage.
 */
export interface GlobalLimits {
  idx: number;
  id: string;
  t_min: string;
  t_max: string;
  l_min: string;
  l_max: string;
  f_min: string;
  f_max: string;
  p_min: string;
  p_max: string;
  m_min: string;
  m_max: string;
  a_min: string;
  a_max: string;
  s_min: string;
  s_max: string;
  w_min: string;
  w_max: string;
  r_min: string;
  r_max: string;
}

/**
 * Plant list item - minimal fields for list view
 */
export interface PlantListItem {
  id: string;
  type: string;
  description?: string | null;
}

/**
 * Full plant - all columns from plants table for detail view
 */
export interface Plant {
  id: string;
  type: string;
  kind?: string | null;
  status?: string | null;
  description?: string | null;
  price?: number | null;
  f_max?: number | null;
  f_min?: number | null;
  f_opt?: number | null;
  fy_max?: number | null;
  fy_min?: number | null;
  fyield?: number | null;
  l_max?: number | null;
  l_min?: number | null;
  l_opt?: number | null;
  ly_max?: number | null;
  ly_min?: number | null;
  m_max?: number | null;
  m_min?: number | null;
  m_opt?: number | null;
  my_max?: number | null;
  my_min?: number | null;
  p_max?: number | null;
  p_min?: number | null;
  p_opt?: number | null;
  py_max?: number | null;
  py_min?: number | null;
  t_max?: number | null;
  t_min?: number | null;
  t_opt?: number | null;
  ty_max?: number | null;
  ty_min?: number | null;
  tf_max?: number | null;
  tf_min?: number | null;
  a_max?: number | null;
  a_min?: number | null;
  a_opt?: number | null;
  ay_max?: number | null;
  ay_min?: number | null;
  s_opt?: number | null;
  w_opt?: number | null;
  r_opt?: number | null;
  establish_ms?: number | null;
  flowering_ms?: number | null;
  rest_ms?: number | null;
  yield_ms?: number | null;
  lifespan_ms?: number | null;
  decomposition_rate_per_day_grams?: number | null;
  nutrient_uptake_rate?: number | null;
  max_growth_per_day_grams?: number | null;
  damage_multiplier?: number | null;
  rest_exit_threshold?: number | null;
  yield_repeats?: number | null;
  plant_color_key?: string | null;
  grams_per_percent_fertility?: number | null;
  fruit_weight_g?: number | null;
  fruit_weight_grams?: number | null;
  reproduction_enabled?: boolean | null;
  spread_distance_tiles?: number | null;
  yield_visual_asset_id?: string | null;
  environment_effects?: unknown;
  /** Effects this plant has on surroundings: ΔT, ΔL, ΔF, ΔP, ΔM, ΔA, ΔW, ΔR */
  effects?: PlantEffects | null;
  yield_svg_data?: string | null;
}

export interface PlantEffects {
  delta_t?: number;
  delta_l?: number;
  delta_f?: number;
  delta_p?: number;
  delta_m?: number;
  delta_a?: number;
  delta_s?: number;
  delta_w?: number;
  delta_r?: number;
}
