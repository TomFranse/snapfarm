import { Box, Container } from "@mui/material";
import { useGameContext } from "@features/card-game/context/GameProvider";
import { useCardInteraction } from "@features/card-game/hooks/useCardInteraction";
import { GameBoard } from "@features/card-game/components/GameBoard/GameBoard";
import { CardHand } from "@features/card-game/components/CardHand/CardHand";

export const HomePage = () => {
  const { board, hand, scorePopup, playCard } = useGameContext();
  const interaction = useCardInteraction(playCard);

  return (
    <Container maxWidth="md">
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <GameBoard
          board={board}
          scorePopup={scorePopup}
          dropTargetSlotIndex={interaction.dropTargetSlotIndex}
          onSlotDragOver={interaction.onSlotDragOver}
          onSlotDragLeave={interaction.onSlotDragLeave}
          onSlotDrop={interaction.onSlotDrop}
          onSlotClick={interaction.onSlotClick}
        />
        <CardHand
          cards={hand}
          selectedCardId={interaction.selectedCardId}
          onCardSelect={interaction.onCardSelect}
          onCardDragStart={interaction.onCardDragStart}
          onCardDragEnd={interaction.onCardDragEnd}
        />
      </Box>
    </Container>
  );
};
