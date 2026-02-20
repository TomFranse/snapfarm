/**
 * Card Game Types
 *
 * Core data structures for the card game feature.
 */

export interface CardVariables {
  values: [number, number, number, number, number, number, number];
}

export interface GameCard {
  id: string;
  variables: CardVariables;
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
}
