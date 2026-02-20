/**
 * GameBoard - 3x3 grid of CardSlots (score displayed in BottomNav)
 */

import { Box } from "@mui/material";
import type { Slot } from "@features/card-game/types/cardGame.types";
import { CardSlot } from "@features/card-game/components/CardSlot/CardSlot";
import type { ScorePopupState } from "@features/card-game/types/cardGame.types";

export interface GameBoardProps {
  board: Slot[];
  scorePopup: ScorePopupState | null;
  dropTargetSlotIndex: number | null;
  onSlotDragOver: (e: React.DragEvent, slotIndex: number) => void;
  onSlotDragLeave: () => void;
  onSlotDrop: (e: React.DragEvent, slotIndex: number) => void;
  onSlotClick: (slotIndex: number) => void;
}

export function GameBoard({
  board,
  scorePopup,
  dropTargetSlotIndex,
  onSlotDragOver,
  onSlotDragLeave,
  onSlotDrop,
  onSlotClick,
}: GameBoardProps) {
  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2,
          maxWidth: 400,
        }}
      >
        {board.map((slot, index) => (
          <CardSlot
            key={slot.id}
            slot={slot}
            slotIndex={index}
            isDropTarget={dropTargetSlotIndex === index}
            scorePopup={scorePopup}
            onDragOver={onSlotDragOver}
            onDragLeave={onSlotDragLeave}
            onDrop={onSlotDrop}
            onClick={onSlotClick}
          />
        ))}
      </Box>
    </Box>
  );
}
