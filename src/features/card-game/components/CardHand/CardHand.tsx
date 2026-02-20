/**
 * CardHand - Player's hand (3 cards) with selection highlighting
 */

import { Box, Typography } from "@mui/material";
import type { GameCard } from "@features/card-game/types/cardGame.types";
import { GameCard as GameCardComponent } from "@features/card-game/components/GameCard/GameCard";

export interface CardHandProps {
  cards: GameCard[];
  selectedCardId: string | null;
  onCardSelect: (cardId: string) => void;
  onCardDragStart: (e: React.DragEvent, cardId: string) => void;
  onCardDragEnd: () => void;
}

export function CardHand({
  cards,
  selectedCardId,
  onCardSelect,
  onCardDragStart,
  onCardDragEnd,
}: CardHandProps) {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        Your Hand
      </Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {cards.map((card) => (
          <GameCardComponent
            key={card.id}
            card={card}
            selected={selectedCardId === card.id}
            draggable
            onDragStart={onCardDragStart}
            onDragEnd={onCardDragEnd}
            onClick={onCardSelect}
          />
        ))}
      </Box>
    </Box>
  );
}
