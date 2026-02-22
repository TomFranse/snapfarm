/**
 * Card Game State Hook
 *
 * Manages board, hand, totalScore, and playCard orchestration.
 */

import { useState, useCallback, useEffect } from "react";
import type {
  AppliedEffectDeltas,
  GameCard,
  Slot,
  ScorePopupState,
} from "@features/card-game/types/cardGame.types";
import type { GlobalLimitsForCard, PlantForCard } from "@features/card-game/types/cardGame.types";
import { DEFAULT_GLOBAL_LIMITS } from "@features/plants/types/globalLimitsDefaults";
import {
  createInitialBoard,
  createInitialHand,
  generateCardOrPlantCard,
  calculateScore,
  applyAdjacentEffects,
  revertAdjacentEffects,
  getAllPlacementScores,
  assignRanksWithTies,
  getBonusForRank,
} from "@features/card-game/services/gameLogic";

const SCORE_POPUP_DURATION_MS = 1500;

export type { ScorePopupState } from "@features/card-game/types/cardGame.types";

export function useGameState(
  plants: PlantForCard[] = [],
  limits: GlobalLimitsForCard | null = null
) {
  const [board, setBoard] = useState<Slot[]>(() => createInitialBoard());
  const [hand, setHand] = useState<GameCard[]>(() => createInitialHand());
  const [totalScore, setTotalScore] = useState(0);
  const [scorePopup, setScorePopup] = useState<ScorePopupState | null>(null);

  useEffect(() => {
    if (scorePopup === null) return;
    const timer = setTimeout(() => setScorePopup(null), SCORE_POPUP_DURATION_MS);
    return () => clearTimeout(timer);
  }, [scorePopup]);

  const playCard = useCallback(
    (cardId: string, slotIndex: number): boolean => {
      const card = hand.find((c) => c.id === cardId);
      const slot = board[slotIndex];
      if (!card || !slot || slot.card !== null) return false;

      const score = calculateScore(card.variables, slot.variables);
      const placements = getAllPlacementScores(hand, board);
      const ranks = assignRanksWithTies(placements);
      const rank = ranks.get(`${cardId}-${slotIndex}`);
      const bonus = getBonusForRank(rank);

      const effectiveLimits: GlobalLimitsForCard = limits ?? {
        l_min: DEFAULT_GLOBAL_LIMITS.l_min,
        l_max: DEFAULT_GLOBAL_LIMITS.l_max,
        s_min: DEFAULT_GLOBAL_LIMITS.s_min,
        s_max: DEFAULT_GLOBAL_LIMITS.s_max,
        m_min: DEFAULT_GLOBAL_LIMITS.m_min,
        m_max: DEFAULT_GLOBAL_LIMITS.m_max,
        w_min: DEFAULT_GLOBAL_LIMITS.w_min,
        w_max: DEFAULT_GLOBAL_LIMITS.w_max,
        r_min: DEFAULT_GLOBAL_LIMITS.r_min,
        r_max: DEFAULT_GLOBAL_LIMITS.r_max,
      };
      const nextCard = generateCardOrPlantCard(plants, effectiveLimits);

      setTotalScore((s) => s + score + bonus);
      setScorePopup({ score, slotIndex, bonus, rank });
      setHand((prevHand) => {
        const filtered = prevHand.filter((c) => c.id !== cardId);
        return [...filtered, nextCard];
      });

      setBoard((prevBoard) => {
        let nextBoard = prevBoard.map((s, i) =>
          i === slotIndex ? { ...s, card: { ...card }, variables: s.variables } : { ...s }
        );
        const { board: afterEffects, deltas } = applyAdjacentEffects(
          nextBoard,
          slotIndex,
          card.effects
        );
        nextBoard = afterEffects.map((s, i) => {
          if (i !== slotIndex || s.card === null) return s;
          const placedCard = { ...s.card, appliedEffectDeltas: deltas };
          return { ...s, card: placedCard };
        });

        const toRevert: AppliedEffectDeltas[] = [];
        nextBoard = nextBoard.map((s) => {
          if (s.card === null) return s;
          const newDuration = s.card.duration - 1;
          if (newDuration <= 0) {
            if (s.card.appliedEffectDeltas) {
              toRevert.push(s.card.appliedEffectDeltas);
            }
            return { ...s, card: null };
          }
          return { ...s, card: { ...s.card, duration: newDuration } };
        });

        for (const deltasToRevert of toRevert) {
          nextBoard = revertAdjacentEffects(nextBoard, deltasToRevert);
        }
        return nextBoard;
      });

      return true;
    },
    [board, hand, plants, limits]
  );

  return { board, hand, totalScore, scorePopup, playCard };
}
