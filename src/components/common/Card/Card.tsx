/**
 * Card - Unified card component for all card-like UI (content, slots, game cards)
 *
 * Variants:
 * - content: Setup cards with CardHeader/Content/Actions
 * - slot: Board slots (empty or occupied), drop targets
 * - game-card: Draggable cards in hand or on board
 *
 * All card and slot variants use fixed dimensions (Pokemon card aspect ratio ~5:7).
 */

import { Card as MuiCard, CardProps as MuiCardProps, SxProps, Theme } from "@mui/material";

/** Fixed dimensions for slot and game-card variants (Pokemon card ~2.5"x3.5" = 5:7) */
export const CARD_DIMENSIONS = {
  width: 120,
  height: 168,
} as const;

export type CardVariant = "content" | "slot" | "game-card";

export interface CardProps extends Omit<MuiCardProps, "variant"> {
  /**
   * Visual and behavioral variant
   * @default "content"
   */
  variant?: CardVariant;
  /**
   * Content variant: hover elevation effect
   * @default true
   */
  hoverable?: boolean;
  /**
   * Content variant: base elevation
   * @default 1
   */
  baseElevation?: number;
  /**
   * Content variant: elevation on hover
   * @default 6
   */
  hoverElevation?: number;
  /**
   * Slot variant: highlight as drop target
   * @default false
   */
  isDropTarget?: boolean;
  /**
   * Slot variant: slot is empty (clickable)
   * @default true
   */
  isEmpty?: boolean;
  /**
   * Game-card variant: selected state (stronger border)
   * @default false
   */
  selected?: boolean;
  /**
   * Game-card variant: draggable
   * @default false
   */
  draggable?: boolean;
}

const baseSlotSx: SxProps<Theme> = {
  width: CARD_DIMENSIONS.width,
  height: CARD_DIMENSIONS.height,
  p: 1,
  display: "flex",
  flexDirection: "column",
  borderRadius: 2,
  position: "relative",
  overflow: "hidden",
};

function getContentSx(hoverable: boolean, hoverElevation: number): SxProps<Theme> {
  return {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    maxWidth: 400,
    width: "100%",
    borderRadius: 4,
    transition: "box-shadow 0.2s ease-in-out",
    "& .MuiCardHeader-root": { padding: 3 },
    "& .MuiCardContent-root": { padding: 3 },
    "& .MuiCardActions-root": { padding: 3 },
    ...(hoverable && { "&:hover": { boxShadow: hoverElevation } }),
  };
}

function getSlotSx(isDropTarget: boolean, isEmpty: boolean): SxProps<Theme> {
  return {
    ...baseSlotSx,
    border: isDropTarget ? 2 : 1,
    borderColor: isDropTarget ? "primary.main" : "divider",
    backgroundColor: isDropTarget ? "action.hover" : "background.paper",
    cursor: isEmpty ? "pointer" : "default",
  };
}

function getGameCardSx(selected: boolean, draggable: boolean): SxProps<Theme> {
  return {
    ...baseSlotSx,
    border: selected ? 2 : 1,
    borderColor: selected ? "primary.main" : "divider",
    cursor: draggable ? "grab" : "default",
    ...(draggable && { "&:active": { cursor: "grabbing" } }),
  };
}

function getVariantSx(
  variant: CardVariant,
  opts: {
    hoverable: boolean;
    hoverElevation: number;
    isDropTarget: boolean;
    isEmpty: boolean;
    selected: boolean;
    draggable: boolean;
  }
): SxProps<Theme> {
  if (variant === "content") {
    return getContentSx(opts.hoverable, opts.hoverElevation);
  }
  if (variant === "slot") {
    return getSlotSx(opts.isDropTarget, opts.isEmpty);
  }
  return getGameCardSx(opts.selected, opts.draggable);
}

function getElevation(opts: {
  variant: CardVariant;
  elevation: number;
  isDropTarget: boolean;
  selected: boolean;
}): number {
  if (opts.variant === "content") return opts.elevation;
  if (opts.variant === "slot") return opts.isDropTarget ? 4 : 1;
  return opts.selected ? 8 : 2;
}

export const Card = ({
  children,
  variant = "content",
  hoverable = true,
  baseElevation = 1,
  hoverElevation = 6,
  elevation = baseElevation,
  isDropTarget = false,
  isEmpty = true,
  selected = false,
  draggable = false,
  sx,
  ...props
}: CardProps) => {
  const variantSx = getVariantSx(variant, {
    hoverable,
    hoverElevation,
    isDropTarget,
    isEmpty,
    selected,
    draggable,
  });
  const finalElevation = getElevation({ variant, elevation, isDropTarget, selected });

  return (
    <MuiCard
      variant="elevation"
      elevation={finalElevation}
      sx={{ ...variantSx, ...(sx ?? {}) } as SxProps<Theme>}
      {...props}
    >
      {children}
    </MuiCard>
  );
};
