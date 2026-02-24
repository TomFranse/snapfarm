import { useMemo } from "react";
import { Box } from "@mui/material";
import { useGameContext } from "@features/card-game/context/GameProvider";
import { useActiveDragContext } from "@features/card-game/context/ActiveDragContext";
import { useCardInteraction } from "@features/card-game/hooks/useCardInteraction";
import { CardGameDndProvider } from "@features/card-game/context/CardGameDndProvider";
import { GameBoard } from "@features/card-game/components/GameBoard/GameBoard";
import { CardHand } from "@features/card-game/components/CardHand/CardHand";
import { getPlacementDataForCard } from "@features/card-game/services/gameLogic";
import { DEBUG_SHOW_PLACEMENT_SCORES } from "@/config/debug";

function HomePageContent() {
  const { board, hand, scorePopup, playCard } = useGameContext();
  const { activeId } = useActiveDragContext();
  const interaction = useCardInteraction(playCard);

  const focusedCardId = activeId ?? interaction.selectedCardId;

  const placementData = useMemo(() => {
    if (!DEBUG_SHOW_PLACEMENT_SCORES || !focusedCardId) return undefined;
    return getPlacementDataForCard(focusedCardId, hand, board);
  }, [DEBUG_SHOW_PLACEMENT_SCORES, focusedCardId, hand, board]);

  return (
    <Box
      sx={(theme) => ({
        width: "100%",
        height: "100%",
        display: "grid",
        gridTemplateRows: "1fr auto",
        justifyItems: "center",
        alignItems: "center",
        rowGap: "var(--game-gap, 16px)",
        overflow: "hidden",
        "--game-gap": theme.layout.cardGame.gameGap.xs,
        "--card-min": theme.layout.cardGame.cardMin.xs,
        "--card-max": theme.layout.cardGame.cardMax.xs,
        "--card-size": "clamp(var(--card-min), min(28dvw, 15dvh), var(--card-max))",
        [theme.breakpoints.up("sm")]: {
          "--game-gap": theme.layout.cardGame.gameGap.sm,
          "--card-min": theme.layout.cardGame.cardMin.sm,
          "--card-max": theme.layout.cardGame.cardMax.sm,
        },
        [theme.breakpoints.up("md")]: {
          "--game-gap": theme.layout.cardGame.gameGap.md,
          "--card-min": theme.layout.cardGame.cardMin.md,
          "--card-max": theme.layout.cardGame.cardMax.md,
        },
        [theme.breakpoints.up("lg")]: {
          "--game-gap": theme.layout.cardGame.gameGap.lg,
          "--card-min": theme.layout.cardGame.cardMin.lg,
          "--card-max": theme.layout.cardGame.cardMax.lg,
        },
      })}
    >
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <GameBoard
          board={board}
          scorePopup={scorePopup}
          onSlotClick={interaction.onSlotClick}
          placementData={placementData}
        />
      </Box>
      <CardHand
        cards={hand}
        selectedCardId={interaction.selectedCardId}
        onCardSelect={interaction.onCardSelect}
      />
    </Box>
  );
}

export const HomePage = () => (
  <CardGameDndProvider>
    <HomePageContent />
  </CardGameDndProvider>
);
