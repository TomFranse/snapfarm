/**
 * GameCard - Card with pip visualization and duration badge, draggable
 */

import { Box, Paper, Typography } from "@mui/material";
import type { GameCard as GameCardType } from "@features/card-game/types/cardGame.types";
import { VariablePips } from "@features/card-game/components/VariablePips/VariablePips";

export interface GameCardProps {
  card: GameCardType;
  selected?: boolean;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, cardId: string) => void;
  onDragEnd?: () => void;
  onClick?: (cardId: string) => void;
  onBoard?: boolean;
}

function CardPaper({
  isDraggable,
  selected,
  children,
  onDragStart,
  onDragEnd,
  onClick,
}: {
  isDraggable: boolean;
  selected: boolean;
  children: React.ReactNode;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  onClick?: () => void;
}) {
  const cursor = isDraggable ? "grab" : "default";
  const border = selected ? 2 : 1;
  const borderColor = selected ? "primary.main" : "divider";
  const elevation = selected ? 8 : 2;

  return (
    <Paper
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      elevation={elevation}
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 1.5,
        minWidth: 100,
        minHeight: 80,
        cursor,
        border,
        borderColor,
        borderRadius: 2,
        position: "relative",
        ...(isDraggable && { "&:active": { cursor: "grabbing" } }),
      }}
    >
      {children}
    </Paper>
  );
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
  const pipSize = onBoard ? "small" : "medium";
  const topMargin = onBoard ? 0 : 2;

  const handleDragStart = (e: React.DragEvent) => {
    if (isDraggable && onDragStart) onDragStart(e, card.id);
  };

  const handleClick = () => {
    if (onClick) onClick(card.id);
  };

  return (
    <CardPaper
      isDraggable={isDraggable}
      selected={selected}
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
      <Box sx={{ mt: topMargin }}>
        <VariablePips variables={card.variables} size={pipSize} />
      </Box>
    </CardPaper>
  );
}
