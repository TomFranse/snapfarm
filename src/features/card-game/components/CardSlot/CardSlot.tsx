/**
 * CardSlot - Single slot (empty or occupied), droppable via dnd-kit
 *
 * When occupied, the card covers the slot like two cards stacked.
 */

import { Box, Typography } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import type { Slot, ScorePopupState } from "@features/card-game/types/cardGame.types";
import type { PlacementDebugData } from "@features/card-game/types/cardGame.types";
import { VariablePips } from "@features/card-game/components/VariablePips/VariablePips";
import { GameCard } from "@features/card-game/components/GameCard/GameCard";
import { ScorePopup } from "@features/card-game/components/ScorePopup/ScorePopup";
import { RANK_LABELS } from "@features/card-game/components/ScorePopup/ScorePopup";
import { Card } from "@/components/common/Card";
import { DEBUG_SHOW_PLACEMENT_SCORES } from "@/config/debug";

export interface CardSlotProps {
  slot: Slot;
  slotIndex: number;
  scorePopup?: ScorePopupState | null;
  onClick?: (slotIndex: number) => void;
  placementDebug?: PlacementDebugData;
}

function renderSlotContent(slot: Slot) {
  if (slot.card === null) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <VariablePips variables={slot.variables} />
      </Box>
    );
  }
  return (
    <Box
      sx={{
        position: "absolute",
        top: -1,
        left: -1,
        right: -1,
        bottom: -1,
        zIndex: 1,
      }}
    >
      <GameCard card={slot.card} onBoard draggable={false} />
    </Box>
  );
}

export function CardSlot({ slot, slotIndex, scorePopup, onClick, placementDebug }: CardSlotProps) {
  const isEmpty = slot.card === null;
  const showScorePopup = scorePopup?.slotIndex === slotIndex;
  const showPlacementDebug = DEBUG_SHOW_PLACEMENT_SCORES && isEmpty && placementDebug !== undefined;

  const { isOver, setNodeRef } = useDroppable({
    id: `slot-${slotIndex}`,
    disabled: !isEmpty,
  });
  const isDropTarget = isOver && isEmpty;

  const handleClick = () => {
    if (onClick) onClick(slotIndex);
  };

  return (
    <Box sx={{ position: "relative", overflow: "visible" }}>
      <Card
        ref={setNodeRef}
        variant="slot"
        isDropTarget={isDropTarget}
        isEmpty={isEmpty}
        onClick={handleClick}
      >
        {renderSlotContent(slot)}
      </Card>
      {showPlacementDebug && placementDebug && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 48,
              fontWeight: 800,
              color: "primary.main",
              opacity: 0.95,
              lineHeight: 1,
            }}
          >
            {placementDebug.score}
          </Typography>
          {placementDebug.rank !== null && (
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: "text.secondary",
                mt: 0.5,
              }}
            >
              {RANK_LABELS[placementDebug.rank]}
            </Typography>
          )}
        </Box>
      )}
      {showScorePopup && scorePopup && (
        <ScorePopup score={scorePopup.score} bonus={scorePopup.bonus} rank={scorePopup.rank} />
      )}
    </Box>
  );
}
