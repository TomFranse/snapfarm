/**
 * CardSlot - Single slot (empty or occupied), droppable via dnd-kit
 *
 * When occupied, the card covers the slot like two cards stacked.
 */

import { Box } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import type { Slot, ScorePopupState } from "@features/card-game/types/cardGame.types";
import { VariablePips } from "@features/card-game/components/VariablePips/VariablePips";
import { GameCard } from "@features/card-game/components/GameCard/GameCard";
import { ScorePopup } from "@features/card-game/components/ScorePopup/ScorePopup";
import { Card } from "@/components/common/Card";

export interface CardSlotProps {
  slot: Slot;
  slotIndex: number;
  scorePopup?: ScorePopupState | null;
  onClick?: (slotIndex: number) => void;
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

export function CardSlot({ slot, slotIndex, scorePopup, onClick }: CardSlotProps) {
  const isEmpty = slot.card === null;
  const showScorePopup = scorePopup?.slotIndex === slotIndex;

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
      {showScorePopup && scorePopup && (
        <ScorePopup score={scorePopup.score} bonus={scorePopup.bonus} rank={scorePopup.rank} />
      )}
    </Box>
  );
}
