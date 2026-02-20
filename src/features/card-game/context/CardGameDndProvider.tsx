/**
 * CardGameDndProvider - DndContext + DragOverlay for card game.
 *
 * Wraps game area with dnd-kit. On drop over slot: playCard.
 * On drop outside slots: card returns to hand (no-op).
 */

import { useState, type ReactNode } from "react";
import { Box } from "@mui/material";
import { DragOverlay } from "@dnd-kit/core";
import { useGameContext } from "@features/card-game/context/GameProvider";
import { AppDndContext } from "@/shared/context/DndContext";
import { GameCard } from "@features/card-game/components/GameCard/GameCard";
import { parseSlotIndex } from "@features/card-game/services/dndSlotIds";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";

export function CardGameDndProvider({ children }: { children: ReactNode }) {
  const { hand, board, playCard } = useGameContext();
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const slotIndex = over ? parseSlotIndex(over.id) : null;
    if (slotIndex !== null && board[slotIndex]?.card === null) {
      playCard(String(active.id), slotIndex);
    }
    setActiveId(null);
  };

  const activeCard = activeId ? hand.find((c) => c.id === activeId) : null;

  return (
    <AppDndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {children}
      <DragOverlay dropAnimation={null} style={{ position: "fixed", zIndex: 1300 }}>
        {activeCard ? (
          <Box sx={{ cursor: "grabbing", display: "inline-block" }}>
            <GameCard card={activeCard} onBoard={false} draggable={false} />
          </Box>
        ) : null}
      </DragOverlay>
    </AppDndContext>
  );
}
