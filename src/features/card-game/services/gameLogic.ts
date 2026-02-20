/**
 * Card Game Logic
 *
 * Pure functions for card generation, scoring, and adjacency.
 */

import type { CardVariables, GameCard, Slot } from "@features/card-game/types/cardGame.types";

const VARIABLE_COUNT = 7;
const MAX_VARIABLE_VALUE = 10;
const MIN_DURATION = 1;
const MAX_DURATION = 10;
const MAX_SCORE = 70;

let idCounter = 0;

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateVariables(): CardVariables {
  const values = Array.from({ length: VARIABLE_COUNT }, () =>
    randomInt(0, MAX_VARIABLE_VALUE)
  ) as CardVariables["values"];
  return { values };
}

export function generateCard(): GameCard {
  idCounter += 1;
  return {
    id: `card-${idCounter}`,
    variables: generateVariables(),
    duration: randomInt(MIN_DURATION, MAX_DURATION),
  };
}

export function calculateScore(cardVariables: CardVariables, slotVariables: CardVariables): number {
  let diffSum = 0;
  for (let i = 0; i < VARIABLE_COUNT; i += 1) {
    diffSum += Math.abs(cardVariables.values[i] - slotVariables.values[i]);
  }
  return Math.max(0, MAX_SCORE - diffSum);
}

const ADJACENCY: Record<number, number[]> = {
  0: [1, 3],
  1: [0, 2, 4],
  2: [1, 5],
  3: [0, 4, 6],
  4: [1, 3, 5, 7],
  5: [2, 4, 8],
  6: [3, 7],
  7: [4, 6, 8],
  8: [5, 7],
};

export function getAdjacentSlotIndices(slotIndex: number): number[] {
  return ADJACENCY[slotIndex] ?? [];
}

export function createInitialBoard(): Slot[] {
  return Array.from({ length: 9 }, (_, i) => ({
    id: i,
    variables: generateVariables(),
    card: null,
  }));
}

export function createInitialHand(): GameCard[] {
  return [generateCard(), generateCard(), generateCard()];
}

export function resetAdjacentEmptySlots(board: Slot[], placedSlotIndex: number): Slot[] {
  const adjacentIndices = getAdjacentSlotIndices(placedSlotIndex);
  return board.map((slot, index) => {
    if (adjacentIndices.includes(index) && slot.card === null) {
      return { ...slot, variables: generateVariables() };
    }
    return slot;
  });
}
