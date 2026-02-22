/**
 * GameProvider - App-level context for card game state.
 * Lifts useGameState so score can be consumed by BottomNav and HomePage.
 * Fetches plants for random plant cards in hand.
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useGameState } from "@features/card-game/hooks/useGameState";
import { usePlantCardImageMap } from "@features/card-game/hooks/usePlantCardImageMap";
import type {
  GameCard,
  GlobalLimitsForCard,
  PlantForCard,
  Slot,
  ScorePopupState,
} from "@features/card-game/types/cardGame.types";
import { getPlantsForCards } from "@features/plants/services/plantsService";
import { DEFAULT_GLOBAL_LIMITS } from "@features/plants/types/globalLimitsDefaults";

export interface GameContextValue {
  board: Slot[];
  hand: GameCard[];
  totalScore: number;
  scorePopup: ScorePopupState | null;
  playCard: (cardId: string, slotIndex: number) => boolean;
  plantCardImageUrls: Record<string, string>;
}

const GameContext = createContext<GameContextValue | null>(null);

const LIMITS: GlobalLimitsForCard = {
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

export function GameProvider({ children }: { children: ReactNode }) {
  const [plants, setPlants] = useState<PlantForCard[]>([]);

  useEffect(() => {
    getPlantsForCards()
      .then((data) => setPlants(data as PlantForCard[]))
      .catch(() => setPlants([]));
  }, []);

  const gameState = useGameState(plants, LIMITS);
  const plantCardImageUrls = usePlantCardImageMap(gameState.hand, gameState.board);
  const value = { ...gameState, plantCardImageUrls };
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameContext(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGameContext must be used within GameProvider");
  return ctx;
}
