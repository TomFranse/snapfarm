/**
 * Card Game State Hook
 *
 * Manages board, hand, totalScore, and playCard orchestration.
 */

import { useState, useCallback, useEffect } from "react";
import type { GameCard, Slot, ScorePopupState } from "@features/card-game/types/cardGame.types";
import {
  createInitialBoard,
  createInitialHand,
  generateCard,
  calculateScore,
  resetAdjacentEmptySlots,
  getAllPlacementScores,
  assignRanksWithTies,
  getBonusForRank,
} from "@features/card-game/services/gameLogic";

const SCORE_POPUP_DURATION_MS = 1500;

export type { ScorePopupState } from "@features/card-game/types/cardGame.types";

export function useGameState() {
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

      setTotalScore((s) => s + score + bonus);
      setScorePopup({ score, slotIndex, bonus, rank });
      setHand((prevHand) => {
        const filtered = prevHand.filter((c) => c.id !== cardId);
        return [...filtered, generateCard()];
      });

      setBoard((prevBoard) => {
        let nextBoard = prevBoard.map((s, i) =>
          i === slotIndex ? { ...s, card: { ...card }, variables: s.variables } : { ...s }
        );
        nextBoard = resetAdjacentEmptySlots(nextBoard, slotIndex);
        nextBoard = nextBoard.map((s) => {
          if (s.card === null) return s;
          const newDuration = s.card.duration - 1;
          if (newDuration <= 0) return { ...s, card: null };
          return { ...s, card: { ...s.card, duration: newDuration } };
        });
        return nextBoard;
      });

      return true;
    },
    [board, hand]
  );

  return { board, hand, totalScore, scorePopup, playCard };
}
