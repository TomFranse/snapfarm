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
import { ActiveDragProvider } from "@features/card-game/context/ActiveDragContext";
import { AppDndContext } from "@/shared/context/DndContext";
import { GameCard } from "@features/card-game/components/GameCard/GameCard";
import { parseSlotIndex } from "@features/card-game/services/dndSlotIds";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";

export function CardGameDndProvider({ children }: { children: ReactNode }) {
  const { hand, board, playCard } = useGameContext();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeCardWidth, setActiveCardWidth] = useState<number | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const activeCardId = String(event.active.id);
    setActiveId(activeCardId);
    const activeNode = document.querySelector<HTMLElement>(`[data-card-id="${activeCardId}"]`);
    if (activeNode) {
      const rectWidth = activeNode.getBoundingClientRect().width;
      setActiveCardWidth(rectWidth > 0 ? rectWidth : null);
      return;
    }
    const initialRect = event.active.rect.current.initial ?? event.active.rect.current.translated;
    setActiveCardWidth(initialRect?.width ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const slotIndex = over ? parseSlotIndex(over.id) : null;
    if (slotIndex !== null && board[slotIndex]?.card === null) {
      playCard(String(active.id), slotIndex);
    }
    setActiveId(null);
    setActiveCardWidth(null);
  };

  const activeCard = activeId ? hand.find((c) => c.id === activeId) : null;

  return (
    <AppDndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <ActiveDragProvider activeId={activeId}>
        {children}
        <DragOverlay
          adjustScale={false}
          dropAnimation={null}
          style={{ position: "fixed", zIndex: 1300 }}
        >
          {activeCard ? (
            <Box
              sx={{
                cursor: "grabbing",
                display: "inline-block",
                ...(activeCardWidth !== null ? { "--card-size": `${activeCardWidth}px` } : {}),
              }}
            >
              <GameCard card={activeCard} onBoard={false} draggable={false} />
            </Box>
          ) : null}
        </DragOverlay>
      </ActiveDragProvider>
    </AppDndContext>
  );
}
