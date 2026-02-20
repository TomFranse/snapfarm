/**
 * GameProvider - App-level context for card game state.
 * Lifts useGameState so score can be consumed by BottomNav and HomePage.
 */

import { createContext, useContext, type ReactNode } from "react";
import { useGameState } from "@features/card-game/hooks/useGameState";
import type { Slot, ScorePopupState, GameCard } from "@features/card-game/types/cardGame.types";

export interface GameContextValue {
  board: Slot[];
  hand: GameCard[];
  totalScore: number;
  scorePopup: ScorePopupState | null;
  playCard: (cardId: string, slotIndex: number) => boolean;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const value = useGameState();
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameContext(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGameContext must be used within GameProvider");
  return ctx;
}
