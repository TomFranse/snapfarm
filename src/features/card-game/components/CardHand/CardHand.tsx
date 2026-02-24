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
}

export function CardHand({ cards, selectedCardId, onCardSelect }: CardHandProps) {
  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        Your Hand
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, var(--card-size, 120px))",
          gap: "var(--game-gap, 16px)",
          width: "fit-content",
        }}
      >
        {cards.map((card) => (
          <GameCardComponent
            key={card.id}
            card={card}
            selected={selectedCardId === card.id}
            draggable
            onClick={onCardSelect}
          />
        ))}
      </Box>
    </Box>
  );
}
