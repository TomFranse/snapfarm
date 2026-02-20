/**
 * Card Interaction Hook
 *
 * Manages drag-and-drop (HTML5) and click-to-select for card placement.
 */

import { useState, useCallback } from "react";

const DRAG_DATA_KEY = "card-game/card-id";

export interface CardInteractionState {
  selectedCardId: string | null;
  draggedCardId: string | null;
  dropTargetSlotIndex: number | null;
}

export interface CardInteractionHandlers {
  onCardSelect: (cardId: string) => void;
  onCardDragStart: (e: React.DragEvent, cardId: string) => void;
  onCardDragEnd: () => void;
  onSlotDragOver: (e: React.DragEvent, slotIndex: number) => void;
  onSlotDragLeave: () => void;
  onSlotDrop: (e: React.DragEvent, slotIndex: number) => string | null;
  onSlotClick: (slotIndex: number) => string | null;
  clearSelection: () => void;
}

export function useCardInteraction(
  playCard: (cardId: string, slotIndex: number) => boolean
): CardInteractionState & CardInteractionHandlers {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [dropTargetSlotIndex, setDropTargetSlotIndex] = useState<number | null>(null);

  const onCardSelect = useCallback((cardId: string) => {
    setSelectedCardId((prev) => (prev === cardId ? null : cardId));
  }, []);

  const onCardDragStart = useCallback((e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData(DRAG_DATA_KEY, cardId);
    e.dataTransfer.effectAllowed = "move";
    setDraggedCardId(cardId);
    setSelectedCardId(null);
  }, []);

  const onCardDragEnd = useCallback(() => {
    setDraggedCardId(null);
    setDropTargetSlotIndex(null);
  }, []);

  const onSlotDragOver = useCallback((e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropTargetSlotIndex(slotIndex);
  }, []);

  const onSlotDragLeave = useCallback(() => {
    setDropTargetSlotIndex(null);
  }, []);

  const onSlotDrop = useCallback(
    (e: React.DragEvent, slotIndex: number): string | null => {
      e.preventDefault();
      setDropTargetSlotIndex(null);
      setDraggedCardId(null);
      const cardId = e.dataTransfer.getData(DRAG_DATA_KEY);
      if (!cardId) return null;
      const played = playCard(cardId, slotIndex);
      return played ? cardId : null;
    },
    [playCard]
  );

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
    draggedCardId,
    dropTargetSlotIndex,
    onCardSelect,
    onCardDragStart,
    onCardDragEnd,
    onSlotDragOver,
    onSlotDragLeave,
    onSlotDrop,
    onSlotClick,
    clearSelection,
  };
}
