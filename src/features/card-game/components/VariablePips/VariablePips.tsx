/**
 * VariablePips - Renders 7 variables as 5 pips each (half/full fill)
 *
 * Uses CSS Grid for exact positioning - identical layout for hand cards,
 * board cards, and empty slots.
 *
 * Optional effects column: when `effects` is provided, renders a column of
 * indicators (up/down/neutral) to the right of the pip grid.
 *
 * Colors and dimensions from theme palette.game.
 */

import { Box, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import type { CardVariables, EffectTuple } from "@features/card-game/types/cardGame.types";

const ROWS = 7;
const COLS = 5;

const EFFECT_COLOR_UP = "#54B54A";
const EFFECT_COLOR_DOWN = "#BA1A1A";

function ArrowFromPublic({
  direction,
  size,
  color,
}: {
  direction: "up" | "down";
  size: number;
  color: string;
}) {
  const base = import.meta.env.BASE_URL;
  const src = direction === "up" ? `${base}arrow-up.svg` : `${base}arrow-down.svg`;
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        width: size,
        height: size,
        backgroundColor: color,
        mask: `url(${src}) center / contain no-repeat`,
        WebkitMask: `url(${src}) center / contain no-repeat`,
      }}
    />
  );
}

function getPipFills(value: number): (0 | 1 | 2)[] {
  const pips: (0 | 1 | 2)[] = [0, 0, 0, 0, 0];
  let remaining = Math.max(0, Math.min(10, value));
  for (let i = 0; i < 5 && remaining > 0; i += 1) {
    const fill = Math.min(2, remaining) as 0 | 1 | 2;
    pips[i] = fill;
    remaining -= fill;
  }
  return pips;
}

export interface VariablePipsProps {
  variables: CardVariables;
  effects?: EffectTuple;
}

export function VariablePips({ variables, effects }: VariablePipsProps) {
  const theme = useTheme();
  const { variableColors, pipEmpty, pipSize, pipGap } = theme.palette.game;

  const cells = variables.values.flatMap((value, varIndex) => {
    const fills = getPipFills(value);
    const color = variableColors[varIndex] ?? variableColors[0];
    return fills.map((fill, pipIndex) => ({ fill, color, key: `${varIndex}-${pipIndex}` }));
  });

  const pipGrid = (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, ${pipSize}px)`,
        gridTemplateRows: `repeat(${ROWS}, ${pipSize}px)`,
        gap: pipGap,
        width: "fit-content",
      }}
    >
      {cells.map(({ fill, color, key }) => (
        <Box
          key={key}
          sx={{
            width: pipSize,
            height: pipSize,
            borderRadius: "50%",
            backgroundColor: fill === 0 ? pipEmpty : fill === 1 ? alpha(color, 0.5) : color,
          }}
        />
      ))}
    </Box>
  );

  if (!effects) {
    return pipGrid;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: pipGap }}>
      {pipGrid}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `${pipSize}px`,
          gridTemplateRows: `repeat(${ROWS}, ${pipSize}px)`,
          gap: pipGap,
        }}
      >
        {effects.map((dir, i) => {
          if (dir === "up") {
            return (
              <Box
                key={i}
                sx={{
                  width: pipSize,
                  height: pipSize,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ArrowFromPublic direction="up" size={pipSize} color={EFFECT_COLOR_UP} />
              </Box>
            );
          }
          if (dir === "down") {
            return (
              <Box
                key={i}
                sx={{
                  width: pipSize,
                  height: pipSize,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ArrowFromPublic direction="down" size={pipSize} color={EFFECT_COLOR_DOWN} />
              </Box>
            );
          }
          return (
            <Box
              key={i}
              sx={{
                width: pipSize,
                height: pipSize,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
              }}
            >
              <CropSquareIcon sx={{ fontSize: pipSize }} />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
