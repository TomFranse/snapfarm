/**
 * GameCard - Card with pip visualization and duration badge, draggable
 */

import { Box, Typography } from "@mui/material";
import type { GameCard as GameCardType } from "@features/card-game/types/cardGame.types";
import { VariablePips } from "@features/card-game/components/VariablePips/VariablePips";
import { Card } from "@/components/common/Card";

export interface GameCardProps {
  card: GameCardType;
  selected?: boolean;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, cardId: string) => void;
  onDragEnd?: () => void;
  onClick?: (cardId: string) => void;
  onBoard?: boolean;
}

export function GameCard({
  card,
  selected = false,
  draggable = true,
  onDragStart,
  onDragEnd,
  onClick,
  onBoard = false,
}: GameCardProps) {
  const isDraggable = draggable && !onBoard;

  const handleDragStart = (e: React.DragEvent) => {
    if (isDraggable && onDragStart) onDragStart(e, card.id);
  };

  const handleClick = () => {
    if (onClick) onClick(card.id);
  };

  return (
    <Card
      variant="game-card"
      selected={selected}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={handleClick}
    >
      <Typography
        variant="caption"
        sx={{
          position: "absolute",
          top: 4,
          right: 8,
          fontWeight: 700,
          color: "text.secondary",
        }}
      >
        {card.duration}
      </Typography>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <VariablePips variables={card.variables} />
      </Box>
    </Card>
  );
}
