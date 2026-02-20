/**
 * VariablePips - Renders 7 variables as 5 pips each (half/full fill)
 */

import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { CardVariables } from "@features/card-game/types/cardGame.types";

const VARIABLE_COLORS = [
  "#FF6B6B",
  "#FFA94D",
  "#FFD93D",
  "#69DB7C",
  "#4DABF7",
  "#B197FC",
  "#F783AC",
] as const;

const PIP_SIZE = 6;
const PIP_GAP = 2;

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
  size?: "small" | "medium";
}

export function VariablePips({ variables, size = "medium" }: VariablePipsProps) {
  const pipSize = size === "small" ? 4 : PIP_SIZE;
  const gap = size === "small" ? 1 : PIP_GAP;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      {variables.values.map((value, varIndex) => {
        const fills = getPipFills(value);
        return (
          <Box
            key={varIndex}
            sx={{
              display: "flex",
              gap: gap,
              alignItems: "center",
            }}
          >
            {fills.map((fill, pipIndex) => (
              <Box
                key={pipIndex}
                sx={{
                  width: pipSize,
                  height: pipSize,
                  borderRadius: "50%",
                  backgroundColor:
                    fill === 0
                      ? "rgba(255,255,255,0.15)"
                      : fill === 1
                        ? alpha(VARIABLE_COLORS[varIndex], 0.5)
                        : VARIABLE_COLORS[varIndex],
                  border: `1px solid ${VARIABLE_COLORS[varIndex]}`,
                }}
              />
            ))}
          </Box>
        );
      })}
    </Box>
  );
}
