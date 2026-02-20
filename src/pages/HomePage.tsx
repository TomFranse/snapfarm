import { Container } from "@mui/material";
import { useGameState } from "@features/card-game/hooks/useGameState";
import { useCardInteraction } from "@features/card-game/hooks/useCardInteraction";
import { GameBoard } from "@features/card-game/components/GameBoard/GameBoard";
import { CardHand } from "@features/card-game/components/CardHand/CardHand";

export const HomePage = () => {
  const { board, hand, totalScore, scorePopup, playCard } = useGameState();
  const interaction = useCardInteraction(playCard);

  return (
    <Container maxWidth="md">
      <GameBoard
        board={board}
        scorePopup={scorePopup}
        totalScore={totalScore}
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
    </Container>
  );
};
