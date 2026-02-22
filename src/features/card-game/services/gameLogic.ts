/**
 * Card Game Logic
 *
 * Pure functions for card generation, scoring, and adjacency.
 */

import type {
  CardVariables,
  EffectTuple,
  EffectDirection,
  GameCard,
  GlobalLimitsForCard,
  PlantForCard,
  Slot,
} from "@features/card-game/types/cardGame.types";

const VARIABLE_COUNT = 5;
const EFFECT_DELTA = 2;
const MAX_VARIABLE_VALUE = 10;
const MIN_DURATION = 1;
const MAX_DURATION = 10;
const MAX_SCORE = 50;

export const BONUS_FIRST = 15;
export const BONUS_SECOND = 8;
export const BONUS_THIRD = 3;

const PLANT_CARD_CHANCE = 0.2;

let idCounter = 0;
let plantIdCounter = 0;

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateVariables(): CardVariables {
  const values = Array.from({ length: VARIABLE_COUNT }, () =>
    randomInt(0, MAX_VARIABLE_VALUE)
  ) as CardVariables["values"];
  return { values };
}

const EFFECT_OPTIONS: EffectTuple[number][] = ["up", "down", "neutral"];

export function generateEffects(): EffectTuple {
  const values = Array.from(
    { length: VARIABLE_COUNT },
    () => EFFECT_OPTIONS[randomInt(0, EFFECT_OPTIONS.length - 1)]
  ) as EffectTuple;
  return values;
}

export function generateCard(): GameCard {
  idCounter += 1;
  return {
    id: `card-${idCounter}`,
    variables: generateVariables(),
    effects: generateEffects(),
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

function optToScale(opt: number | null | undefined, gMin: string, gMax: string): number {
  if (opt === null || opt === undefined) return 0;
  const min = parseFloat(gMin);
  const max = parseFloat(gMax);
  if (min === max) return 5;
  const value = ((opt - min) / (max - min)) * 10;
  return Math.max(0, Math.min(10, Math.round(value)));
}

function deltaToEffect(delta: number | null | undefined): EffectDirection {
  if (delta === null || delta === undefined || delta === 0) return "neutral";
  return delta > 0 ? "up" : "down";
}

export function plantToGameCard(plant: PlantForCard, limits: GlobalLimitsForCard): GameCard {
  plantIdCounter += 1;
  const values = [
    optToScale(plant.l_opt, limits.l_min, limits.l_max),
    optToScale(plant.s_opt, limits.s_min, limits.s_max),
    optToScale(plant.m_opt, limits.m_min, limits.m_max),
    optToScale(plant.w_opt, limits.w_min, limits.w_max),
    optToScale(plant.r_opt, limits.r_min, limits.r_max),
  ] as CardVariables["values"];
  const effects: EffectTuple = [
    deltaToEffect(plant.effects?.delta_l),
    deltaToEffect(plant.effects?.delta_s),
    deltaToEffect(plant.effects?.delta_m),
    deltaToEffect(plant.effects?.delta_w),
    deltaToEffect(plant.effects?.delta_r),
  ];
  return {
    id: `plant-${plant.id}-${plantIdCounter}`,
    variables: { values },
    effects,
    duration: randomInt(MIN_DURATION, MAX_DURATION),
  };
}

export function generateCardOrPlantCard(
  plants: PlantForCard[],
  limits: GlobalLimitsForCard,
  chance: number = PLANT_CARD_CHANCE
): GameCard {
  if (plants.length === 0 || Math.random() >= chance) {
    return generateCard();
  }
  const plant = plants[Math.floor(Math.random() * plants.length)];
  return plantToGameCard(plant, limits);
}

export function applyAdjacentEffects(
  board: Slot[],
  placedSlotIndex: number,
  effects: EffectTuple
): Slot[] {
  const adjacentIndices = getAdjacentSlotIndices(placedSlotIndex);
  return board.map((slot, index) => {
    if (!adjacentIndices.includes(index)) return slot;

    const newValues = [...slot.variables.values] as CardVariables["values"];
    for (let i = 0; i < VARIABLE_COUNT; i += 1) {
      const dir = effects[i];
      if (dir === "up") {
        newValues[i] = Math.min(MAX_VARIABLE_VALUE, newValues[i] + EFFECT_DELTA);
      } else if (dir === "down") {
        newValues[i] = Math.max(0, newValues[i] - EFFECT_DELTA);
      }
    }
    return { ...slot, variables: { values: newValues } };
  });
}

export interface PlacementScore {
  cardId: string;
  slotIndex: number;
  score: number;
}

export function getAllPlacementScores(hand: GameCard[], board: Slot[]): PlacementScore[] {
  const result: PlacementScore[] = [];
  for (const card of hand) {
    for (let i = 0; i < board.length; i += 1) {
      const slot = board[i];
      if (slot.card !== null) continue;
      const score = calculateScore(card.variables, slot.variables);
      result.push({ cardId: card.id, slotIndex: i, score });
    }
  }
  return result;
}

function getGroupSizes(sorted: PlacementScore[]): number[] {
  const sizes: number[] = [];
  let prevScore: number | null = null;
  for (const p of sorted) {
    if (prevScore !== null && p.score < prevScore) sizes.push(0);
    const last = sizes.length - 1;
    if (last >= 0) sizes[last] += 1;
    else sizes.push(1);
    prevScore = p.score;
  }
  return sizes;
}

function getRankForGroupIndex(groupIndex: number, groupSizes: number[]): 1 | 2 | 3 | null {
  if (groupIndex >= 3) return null;
  if (groupIndex === 0) return 1;
  if (groupIndex === 1) return groupSizes[0] === 1 ? 2 : 3;
  return 3;
}

export function assignRanksWithTies(placements: PlacementScore[]): Map<string, 1 | 2 | 3> {
  const sorted = [...placements].sort((a, b) => b.score - a.score);
  const groupSizes = getGroupSizes(sorted);
  const ranks = new Map<string, 1 | 2 | 3>();
  let groupIndex = 0;
  let prevScore: number | null = null;
  for (const p of sorted) {
    if (prevScore !== null && p.score < prevScore) groupIndex += 1;
    const rank = getRankForGroupIndex(groupIndex, groupSizes);
    if (rank !== null) ranks.set(`${p.cardId}-${p.slotIndex}`, rank);
    prevScore = p.score;
  }
  return ranks;
}

export function getBonusForRank(rank: 1 | 2 | 3 | undefined): number {
  if (rank === 1) return BONUS_FIRST;
  if (rank === 2) return BONUS_SECOND;
  if (rank === 3) return BONUS_THIRD;
  return 0;
}
