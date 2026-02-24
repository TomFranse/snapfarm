/**
 * Card Game Types
 *
 * Core data structures for the card game feature.
 */

export interface CardVariables {
  values: [number, number, number, number, number];
}

export type EffectDirection = "up" | "down" | "neutral";

export type EffectTuple = [
  EffectDirection,
  EffectDirection,
  EffectDirection,
  EffectDirection,
  EffectDirection,
];

/** Deltas actually applied to adjacent slots (per variable). Used to revert on card removal. */
export type AppliedEffectDeltas = Record<number, number[]>;

export interface GameCard {
  id: string;
  variables: CardVariables;
  effects: EffectTuple;
  duration: number;
  /** Stored when placed; used to revert effects when card is removed. */
  appliedEffectDeltas?: AppliedEffectDeltas;
}

export interface Slot {
  id: number;
  variables: CardVariables;
  card: GameCard | null;
}

export interface GameState {
  board: Slot[];
  hand: GameCard[];
  totalScore: number;
}

export interface ScorePopupState {
  score: number;
  slotIndex: number;
  bonus?: number;
  rank?: 1 | 2 | 3;
}

/** Debug overlay: score and rank for a single slot option. */
export interface PlacementDebugData {
  score: number;
  rank: 1 | 2 | 3 | null;
}

/** Minimal plant shape for card conversion. Avoids coupling to plants feature. */
export interface PlantForCard {
  id: string;
  l_opt?: number | null;
  s_opt?: number | null;
  m_opt?: number | null;
  w_opt?: number | null;
  r_opt?: number | null;
  effects?: {
    delta_l?: number;
    delta_s?: number;
    delta_m?: number;
    delta_w?: number;
    delta_r?: number;
  } | null;
}

/** Min/max limits for scaling plant opt values to 0–10. */
export interface GlobalLimitsForCard {
  l_min: string;
  l_max: string;
  s_min: string;
  s_max: string;
  m_min: string;
  m_max: string;
  w_min: string;
  w_max: string;
  r_min: string;
  r_max: string;
}
