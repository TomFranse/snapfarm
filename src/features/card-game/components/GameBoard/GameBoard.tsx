/**
 * GameBoard - 3x3 grid of CardSlots (score displayed in BottomNav)
 */

import { Box } from "@mui/material";
import type { Slot } from "@features/card-game/types/cardGame.types";
import { CardSlot } from "@features/card-game/components/CardSlot/CardSlot";
import type { ScorePopupState } from "@features/card-game/types/cardGame.types";
import type { PlacementDebugData } from "@features/card-game/types/cardGame.types";

export interface GameBoardProps {
  board: Slot[];
  scorePopup: ScorePopupState | null;
  onSlotClick: (slotIndex: number) => void;
  placementData?: Map<number, PlacementDebugData>;
}

export function GameBoard({ board, scorePopup, onSlotClick, placementData }: GameBoardProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, var(--card-size, 120px))",
          gap: "var(--game-gap, 16px)",
          width: "fit-content",
        }}
      >
        {board.map((slot, index) => (
          <CardSlot
            key={slot.id}
            slot={slot}
            slotIndex={index}
            scorePopup={scorePopup}
            onClick={onSlotClick}
            placementDebug={placementData?.get(index)}
          />
        ))}
      </Box>
    </Box>
  );
}
