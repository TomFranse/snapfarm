/**
 * Card Interaction Hook
 *
 * Manages tap-to-select (via dnd onDragEnd delta) and tap-to-place.
 * Drop target highlighting uses useDroppable's isOver in CardSlot (dnd-kit standard).
 * Must be used inside DndContext (CardGameDndProvider).
 */

import { useState, useCallback, useMemo } from "react";
import { useDndMonitor } from "@dnd-kit/core";
import type { GameCard } from "@features/card-game/types/cardGame.types";

export interface CardInteractionState {
  selectedCardId: string | null;
}

export interface CardInteractionHandlers {
  onSlotClick: (slotIndex: number) => string | null;
  clearSelection: () => void;
}

const TAP_SLOP_PX = 8;

function isTapRelease(delta: { x: number; y: number }) {
  return Math.hypot(delta.x, delta.y) <= TAP_SLOP_PX;
}

export function useCardInteraction(
  playCard: (cardId: string, slotIndex: number) => boolean,
  hand: GameCard[]
): CardInteractionState & CardInteractionHandlers {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const handCardIds = useMemo(() => new Set(hand.map((card) => card.id)), [hand]);

  useDndMonitor({
    onDragEnd: ({ active, over, delta }) => {
      if (over !== null) {
        setSelectedCardId(null);
        return;
      }

      const activeId = String(active.id);
      if (!handCardIds.has(activeId)) return;

      if (isTapRelease(delta)) {
        setSelectedCardId((prev) => (prev === activeId ? null : activeId));
        return;
      }

      setSelectedCardId(null);
    },
  });

  const onSlotClick = useCallback(
    (slotIndex: number): string | null => {
      if (selectedCardId === null) return null;
      const played = playCard(selectedCardId, slotIndex);
      if (played) {
        setSelectedCardId(null);
        return selectedCardId;
      }
      return null;
    },
    [playCard, selectedCardId]
  );

  const clearSelection = useCallback(() => {
    setSelectedCardId(null);
  }, []);

  return {
    selectedCardId,
    onSlotClick,
    clearSelection,
  };
}
