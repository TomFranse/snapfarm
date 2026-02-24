/**
 * GameCard - Card with pip visualization and duration badge, draggable via dnd-kit
 * Plant cards show the plant's image as background.
 */

import { Box, Typography } from "@mui/material";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { GameCard as GameCardType } from "@features/card-game/types/cardGame.types";
import { VariablePips } from "@features/card-game/components/VariablePips/VariablePips";
import { Card } from "@/components/common/Card";
import { useGameContext } from "@features/card-game/context/GameProvider";

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
  imageUrl,
}: {
  card: GameCardType;
  selected: boolean;
  onClick?: (cardId: string) => void;
  durationBadge: React.ReactNode;
  imageUrl: string | null;
}) {
  const handleClick = () => {
    if (onClick) onClick(card.id);
  };

  const cardSx = imageUrl
    ? {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.5) 100%)",
          borderRadius: "inherit",
          pointerEvents: "none",
        },
      }
    : undefined;

  return (
    <Card
      variant="game-card"
      selected={selected}
      draggable={false}
      onClick={handleClick}
      sx={cardSx}
    >
      {durationBadge}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          position: "relative",
          zIndex: 1,
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
  const { plantCardImageUrls } = useGameContext();
  const imageUrl = plantCardImageUrls[card.id] ?? null;

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
    return (
      <GameCardContent
        card={card}
        selected={false}
        durationBadge={durationBadge}
        imageUrl={imageUrl}
      />
    );
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
      data-card-id={card.id}
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
      <GameCardContent
        card={card}
        selected={selected}
        durationBadge={durationBadge}
        imageUrl={imageUrl}
      />
    </Box>
  );
}
