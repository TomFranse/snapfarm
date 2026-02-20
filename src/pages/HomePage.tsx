import { Box, Container } from "@mui/material";
import { useGameContext } from "@features/card-game/context/GameProvider";
import { useCardInteraction } from "@features/card-game/hooks/useCardInteraction";
import { CardGameDndProvider } from "@features/card-game/context/CardGameDndProvider";
import { GameBoard } from "@features/card-game/components/GameBoard/GameBoard";
import { CardHand } from "@features/card-game/components/CardHand/CardHand";

function HomePageContent() {
  const { board, hand, scorePopup, playCard } = useGameContext();
  const interaction = useCardInteraction(playCard);

  return (
    <Container maxWidth="md">
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <GameBoard board={board} scorePopup={scorePopup} onSlotClick={interaction.onSlotClick} />
        <CardHand
          cards={hand}
          selectedCardId={interaction.selectedCardId}
          onCardSelect={interaction.onCardSelect}
        />
      </Box>
    </Container>
  );
}

export const HomePage = () => (
  <CardGameDndProvider>
    <HomePageContent />
  </CardGameDndProvider>
);
