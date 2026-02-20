/**
 * CardSlot - Single slot (empty or occupied), drop target
 *
 * When occupied, the card covers the slot like two cards stacked.
 */

import { Box } from "@mui/material";
import type { Slot } from "@features/card-game/types/cardGame.types";
import { VariablePips } from "@features/card-game/components/VariablePips/VariablePips";
import { GameCard } from "@features/card-game/components/GameCard/GameCard";
import { ScorePopup } from "@features/card-game/components/ScorePopup/ScorePopup";
import { Card } from "@/components/common/Card";

export interface CardSlotProps {
  slot: Slot;
  slotIndex: number;
  isDropTarget?: boolean;
  scorePopup?: { score: number; slotIndex: number } | null;
  onDragOver?: (e: React.DragEvent, slotIndex: number) => void;
  onDragLeave?: () => void;
  onDrop?: (e: React.DragEvent, slotIndex: number) => void;
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

export function CardSlot({
  slot,
  slotIndex,
  isDropTarget = false,
  scorePopup,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
}: CardSlotProps) {
  const isEmpty = slot.card === null;
  const showScorePopup = scorePopup?.slotIndex === slotIndex;

  const handleDragOver = (e: React.DragEvent) => {
    if (onDragOver && isEmpty) onDragOver(e, slotIndex);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (onDrop && isEmpty) onDrop(e, slotIndex);
  };

  const handleClick = () => {
    if (onClick) onClick(slotIndex);
  };

  return (
    <Card
      variant="slot"
      isDropTarget={isDropTarget}
      isEmpty={isEmpty}
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      {renderSlotContent(slot)}
      {showScorePopup && scorePopup && <ScorePopup score={scorePopup.score} />}
    </Card>
  );
}
