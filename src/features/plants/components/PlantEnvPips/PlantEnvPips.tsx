/**
 * PlantEnvPips - Renders 6 environment variables (T, L, F, P, M, A) as 5 pips each.
 * Uses icons and semantic colors. Same fill logic as VariablePips (card game).
 */

import { Box, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import LightModeIcon from "@mui/icons-material/LightMode";
import GrassIcon from "@mui/icons-material/Grass";
import GrainIcon from "@mui/icons-material/Grain";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import ScienceIcon from "@mui/icons-material/Science";
import type { Plant, GlobalLimits } from "../../types/plants.types";

const COLS = 5;

/** Semantic colors for each env variable */
const ENV_COLORS: Record<string, string> = {
  t: "#B5754A", // Temperature - warm orange
  l: "#E8B923", // Light - yellow/gold
  f: "#54B54A", // Fertility - green
  p: "#8B7355", // Porosity - earth brown
  m: "#4A8AB5", // Moisture - blue
  a: "#AB4AB5", // Acidity - purple
};

const ENV_CONFIG = [
  {
    key: "t" as const,
    optKey: "t_opt" as const,
    minKey: "t_min" as const,
    maxKey: "t_max" as const,
    Icon: ThermostatIcon,
    label: "Temperature",
  },
  {
    key: "l" as const,
    optKey: "l_opt" as const,
    minKey: "l_min" as const,
    maxKey: "l_max" as const,
    Icon: LightModeIcon,
    label: "Light",
  },
  {
    key: "f" as const,
    optKey: "f_opt" as const,
    minKey: "f_min" as const,
    maxKey: "f_max" as const,
    Icon: GrassIcon,
    label: "Fertility",
  },
  {
    key: "p" as const,
    optKey: "p_opt" as const,
    minKey: "p_min" as const,
    maxKey: "p_max" as const,
    Icon: GrainIcon,
    label: "Porosity",
  },
  {
    key: "m" as const,
    optKey: "m_opt" as const,
    minKey: "m_min" as const,
    maxKey: "m_max" as const,
    Icon: WaterDropIcon,
    label: "Moisture",
  },
  {
    key: "a" as const,
    optKey: "a_opt" as const,
    minKey: "a_min" as const,
    maxKey: "a_max" as const,
    Icon: ScienceIcon,
    label: "Acidity",
  },
];

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

function optToScale(opt: number | null | undefined, gMin: string, gMax: string): number {
  if (opt === null || opt === undefined) return 0;
  const min = parseFloat(gMin);
  const max = parseFloat(gMax);
  if (min === max) return 5;
  const value = ((opt - min) / (max - min)) * 10;
  return Math.max(0, Math.min(10, value));
}

export interface PlantEnvPipsProps {
  plant: Plant;
  limits: GlobalLimits;
}

export function PlantEnvPips({ plant, limits }: PlantEnvPipsProps) {
  const theme = useTheme();
  const { pipEmpty, pipSize, pipGap } = theme.palette.game;

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {ENV_CONFIG.map(({ key, optKey, minKey, maxKey, Icon, label }) => {
          const opt = plant[optKey];
          const value = optToScale(opt, limits[minKey], limits[maxKey]);
          const fills = getPipFills(value);
          const color = ENV_COLORS[key] ?? theme.palette.game.variableColors[0];

          return (
            <Box
              key={key}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Icon
                sx={(theme) => ({
                  fontSize: theme.typography.body2.fontSize,
                  color: theme.palette.text.secondary,
                })}
                aria-label={label}
              />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${COLS}, ${pipSize}px)`,
                  gap: pipGap,
                  width: "fit-content",
                }}
              >
                {fills.map((fill, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: pipSize,
                      height: pipSize,
                      borderRadius: "50%",
                      backgroundColor:
                        fill === 0 ? pipEmpty : fill === 1 ? alpha(color, 0.5) : color,
                    }}
                  />
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
