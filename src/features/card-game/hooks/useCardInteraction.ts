/**
 * Card Interaction Hook
 *
 * Manages click-to-select and click-to-place. Drop target highlighting uses
 * useDroppable's isOver in CardSlot (dnd-kit standard).
 * Must be used inside DndContext (CardGameDndProvider).
 */

import { useState, useCallback } from "react";
import { useDndMonitor } from "@dnd-kit/core";

export interface CardInteractionState {
  selectedCardId: string | null;
}

export interface CardInteractionHandlers {
  onCardSelect: (cardId: string) => void;
  onSlotClick: (slotIndex: number) => string | null;
  clearSelection: () => void;
}

export function useCardInteraction(
  playCard: (cardId: string, slotIndex: number) => boolean
): CardInteractionState & CardInteractionHandlers {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  useDndMonitor({ onDragStart: () => setSelectedCardId(null) });

  const onCardSelect = useCallback((cardId: string) => {
    setSelectedCardId((prev) => (prev === cardId ? null : cardId));
  }, []);

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
    onCardSelect,
    onSlotClick,
    clearSelection,
  };
}
