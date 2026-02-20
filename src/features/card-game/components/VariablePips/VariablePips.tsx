/**
 * VariablePips - Renders 7 variables as 5 pips each (half/full fill)
 *
 * Uses CSS Grid for exact positioning - identical layout for hand cards,
 * board cards, and empty slots.
 *
 * Colors and dimensions from theme palette.game.
 */

import { Box, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { CardVariables } from "@features/card-game/types/cardGame.types";

const ROWS = 7;
const COLS = 5;

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
}

export function VariablePips({ variables }: VariablePipsProps) {
  const theme = useTheme();
  const { variableColors, pipEmpty, pipSize, pipGap } = theme.palette.game;

  const cells = variables.values.flatMap((value, varIndex) => {
    const fills = getPipFills(value);
    const color = variableColors[varIndex] ?? variableColors[0];
    return fills.map((fill, pipIndex) => ({ fill, color, key: `${varIndex}-${pipIndex}` }));
  });

  return (
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
}
