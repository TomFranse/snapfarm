/**
 * GameCard - Card with pip visualization and duration badge, draggable via dnd-kit
 */

import { Box, Typography } from "@mui/material";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { GameCard as GameCardType } from "@features/card-game/types/cardGame.types";
import { VariablePips } from "@features/card-game/components/VariablePips/VariablePips";
import { Card } from "@/components/common/Card";

export interface GameCardProps {
  card: GameCardType;
  selected?: boolean;
  draggable?: boolean;
  onClick?: (cardId: string) => void;
  onBoard?: boolean;
}

function GameCardContent({
  card,
  selected = false,
  onClick,
  durationBadge,
}: {
  card: GameCardType;
  selected: boolean;
  onClick?: (cardId: string) => void;
  durationBadge: React.ReactNode;
}) {
  const handleClick = () => {
    if (onClick) onClick(card.id);
  };

  return (
    <Card variant="game-card" selected={selected} draggable={false} onClick={handleClick}>
      {durationBadge}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <VariablePips variables={card.variables} effects={card.effects} />
      </Box>
    </Card>
  );
}

export function GameCard({
  card,
  selected = false,
  draggable = true,
  onClick,
  onBoard = false,
}: GameCardProps) {
  const isDraggable = draggable && !onBoard;

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
    disabled: !isDraggable,
  });

  const durationBadge = (
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
  );

  if (onBoard) {
    return <GameCardContent card={card} selected={false} durationBadge={durationBadge} />;
  }

  // When using DragOverlay, don't transform the original - it stays in place.
  // Only the overlay follows the cursor.
  const style = {
    opacity: isDragging ? 0.5 : 1,
    ...(transform && !isDragging ? { transform: CSS.Translate.toString(transform) } : {}),
  };

  return (
    <Box
      ref={setNodeRef}
      sx={{
        ...style,
        cursor: isDraggable ? "grab" : "default",
        touchAction: isDraggable ? "none" : "auto",
      }}
      {...listeners}
      {...attributes}
      onClick={() => {
        if (!isDragging && onClick) onClick(card.id);
      }}
    >
      <GameCardContent card={card} selected={selected} durationBadge={durationBadge} />
    </Box>
  );
}
