/**
 * CardSlot - Single slot (empty or occupied), drop target
 */

import { Paper } from "@mui/material";
import type { Slot } from "@features/card-game/types/cardGame.types";
import { VariablePips } from "@features/card-game/components/VariablePips/VariablePips";
import { GameCard } from "@features/card-game/components/GameCard/GameCard";
import { ScorePopup } from "@features/card-game/components/ScorePopup/ScorePopup";

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
    return <VariablePips variables={slot.variables} size="small" />;
  }
  return <GameCard card={slot.card} onBoard draggable={false} />;
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
    <Paper
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      elevation={isDropTarget ? 4 : 1}
      sx={{
        minHeight: 120,
        minWidth: 110,
        p: 1,
        position: "relative",
        border: isDropTarget ? 2 : 1,
        borderColor: isDropTarget ? "primary.main" : "divider",
        borderRadius: 2,
        backgroundColor: isDropTarget ? "action.hover" : "background.paper",
        cursor: isEmpty ? "pointer" : "default",
      }}
    >
      {renderSlotContent(slot)}
      {showScorePopup && scorePopup && <ScorePopup score={scorePopup.score} />}
    </Paper>
  );
}
