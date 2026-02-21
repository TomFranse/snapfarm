/**
 * Card Game Types
 *
 * Core data structures for the card game feature.
 */

export interface CardVariables {
  values: [number, number, number, number, number, number, number];
}

export type EffectDirection = "up" | "down" | "neutral";

export type EffectTuple = [
  EffectDirection,
  EffectDirection,
  EffectDirection,
  EffectDirection,
  EffectDirection,
  EffectDirection,
  EffectDirection,
];

export interface GameCard {
  id: string;
  variables: CardVariables;
  effects: EffectTuple;
  duration: number;
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
