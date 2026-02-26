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
import type { DropAnimationFunctionArguments } from "@dnd-kit/core/dist/components/DragOverlay/hooks";

const QUICK_BOUNCE_EASING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const SETTLE_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const DROP_ANIMATION_DURATION_MS = 240;
const SETTLE_OVERSHOOT_SCALE = 1.03;
const SETTLE_SHRINK_SCALE = 0.985;

export function CardGameDndProvider({ children }: { children: ReactNode }) {
  const { hand, board, playCard } = useGameContext();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeCardWidth, setActiveCardWidth] = useState<number | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const activeCardId = String(event.active.id);
    setActiveId(activeCardId);
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

  const activeCard = activeId ? (hand.find((c) => c.id === activeId) ?? null) : null;

  return (
    <AppDndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <ActiveDragProvider activeId={activeId}>
        {children}
        <DragOverlay
          adjustScale={false}
          dropAnimation={async ({ dragOverlay, transform }: DropAnimationFunctionArguments) => {
            const element = dragOverlay.node;
            const translateX = transform.x;
            const translateY = transform.y;

            const animation = (
              element as unknown as {
                animate: (
                  keyframes: Array<Record<string, unknown>>,
                  options: Record<string, unknown>
                ) => { finished: Promise<unknown> };
              }
            ).animate(
              [
                { transform: "translate3d(0px, 0px, 0) scale(1)" },
                {
                  offset: 0.72,
                  transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${SETTLE_OVERSHOOT_SCALE})`,
                },
                {
                  offset: 0.9,
                  transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${SETTLE_SHRINK_SCALE})`,
                },
                { transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(1)` },
              ],
              {
                duration: DROP_ANIMATION_DURATION_MS,
                easing: SETTLE_EASING,
                fill: "forwards",
              }
            );

            try {
              await animation.finished;
            } catch {
              // Ignore cancellations when a new drag starts before settle completes.
            }
          }}
          style={{ position: "fixed", zIndex: 1300, pointerEvents: "none" }}
        >
          {activeCard ? (
            <Box
              sx={{
                cursor: "grabbing",
                display: "inline-block",
                pointerEvents: "none",
                transformOrigin: "center center",
                animation: `cardPickupBounce 150ms ${QUICK_BOUNCE_EASING}`,
                "@keyframes cardPickupBounce": {
                  "0%": { transform: "scale(1)" },
                  "55%": { transform: "scale(1.07)" },
                  "100%": { transform: "scale(1.02)" },
                },
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
