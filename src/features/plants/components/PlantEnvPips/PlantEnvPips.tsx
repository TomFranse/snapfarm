/**
 * PlantEnvPips - Renders 9 environment variables (T, L, F, P, M, A, S, W, R) as 5 pips each.
 * Uses icons and semantic colors. Same fill logic as VariablePips (card game).
 */

import { Box, Divider, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import LightModeIcon from "@mui/icons-material/LightMode";
import GrassIcon from "@mui/icons-material/Grass";
import GrainIcon from "@mui/icons-material/Grain";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import ScienceIcon from "@mui/icons-material/Science";
import LandscapeIcon from "@mui/icons-material/Landscape";
import AirIcon from "@mui/icons-material/Air";
import BugReportIcon from "@mui/icons-material/BugReport";
import type { Plant, GlobalLimits, PlantEffects } from "../../types/plants.types";

const COLS = 5;
const ARROW_SIZE = 12;
const ARROW_COL_WIDTH = 14;

type EffectKey = keyof PlantEffects;

function EffectArrow({
  direction,
  color,
}: {
  direction: "up" | "down";
  color: string;
}) {
  const base = import.meta.env.BASE_URL;
  const src = direction === "up" ? `${base}arrow-up.svg` : `${base}arrow-down.svg`;
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        width: ARROW_SIZE,
        height: ARROW_SIZE,
        minWidth: ARROW_SIZE,
        backgroundColor: color,
        mask: `url(${src}) center / contain no-repeat`,
        WebkitMask: `url(${src}) center / contain no-repeat`,
      }}
    />
  );
}

/** Semantic colors for each env variable */
const ENV_COLORS: Record<string, string> = {
  t: "#B5754A", // Temperature - warm orange
  l: "#E8B923", // Light - yellow/gold
  f: "#54B54A", // Fertility - green
  p: "#8B7355", // Porosity - earth brown
  m: "#4A8AB5", // Moisture - blue
  a: "#AB4AB5", // Acidity - purple
  s: "#6B4423", // Soil - dark earth brown
  w: "#87CEEB", // Wind - sky blue
  r: "#C45C4A", // Pest resistance - red/orange
};

/** Map variable key to effects delta key */
const EFFECT_KEY_MAP: Partial<Record<string, EffectKey>> = {
  l: "delta_l",
  t: "delta_t",
  s: "delta_s",
  m: "delta_m",
  w: "delta_w",
  r: "delta_r",
  f: "delta_f",
  p: "delta_p",
  a: "delta_a",
};

/** Order: Basic: Light, Soil, Moisture, Wind, Pest | Advanced: Temperature, Fertility, Porosity, Acidity */
const ENV_CONFIG = [
  {
    key: "l" as const,
    optKey: "l_opt" as const,
    minKey: "l_min" as const,
    maxKey: "l_max" as const,
    Icon: LightModeIcon,
    label: "Light",
  },
  {
    key: "s" as const,
    optKey: "s_opt" as const,
    minKey: "s_min" as const,
    maxKey: "s_max" as const,
    Icon: LandscapeIcon,
    label: "Soil",
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
    key: "w" as const,
    optKey: "w_opt" as const,
    minKey: "w_min" as const,
    maxKey: "w_max" as const,
    Icon: AirIcon,
    label: "Wind resistance",
  },
  {
    key: "r" as const,
    optKey: "r_opt" as const,
    minKey: "r_min" as const,
    maxKey: "r_max" as const,
    Icon: BugReportIcon,
    label: "Pest resistance",
  },
  {
    key: "t" as const,
    optKey: "t_opt" as const,
    minKey: "t_min" as const,
    maxKey: "t_max" as const,
    Icon: ThermostatIcon,
    label: "Temperature",
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

/**
 * Deltas for L, F, P, M, W, R, S are on 0–100 scale.
 * Soil: 0 = global 25, 10 blips = global 85 (range 60).
 * Deltas for T and A are in °C and pH respectively.
 */
const DELTA_RANGE_0_100 = new Set(["l", "f", "p", "m", "w", "r", "s"]);

/** Convert raw delta to blip scale (0–10). Uses 0–100 range for L,F,P,M,W,R; gMin/gMax for T,A */
function deltaToBlips(delta: number, key: string, gMin: string, gMax: string): number {
  const min = DELTA_RANGE_0_100.has(key) ? 0 : parseFloat(gMin);
  const max = DELTA_RANGE_0_100.has(key) ? 100 : parseFloat(gMax);
  if (min === max) return 0;
  return (delta / (max - min)) * 10;
}

/** Round to nearest 0.5 for half-blip display */
function toHalfBlip(value: number): number {
  return Math.round(value * 2) / 2;
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
        {ENV_CONFIG.map(({ key, optKey, minKey, maxKey, Icon, label }, index) => {
          const opt = plant[optKey];
          const value = optToScale(opt, limits[minKey], limits[maxKey]);
          const fills = getPipFills(value);
          const color = ENV_COLORS[key] ?? theme.palette.game.variableColors[0];
          const showSpacerBefore = index === 5;

          return (
            <Box key={key}>
              {showSpacerBefore && <Divider sx={{ my: 1.5 }} />}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "100%",
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
                {(() => {
                  const effectKey = EFFECT_KEY_MAP[key];
                  const delta = effectKey && plant.effects?.[effectKey];
                  if (delta === undefined || delta === null) return null;
                  const blips = toHalfBlip(
                    deltaToBlips(delta, key, limits[minKey], limits[maxKey])
                  );
                  const sign = blips > 0 ? "+" : "";
                  const invertedColor =
                    blips > 0 ? "error.main" : blips < 0 ? "success.main" : "text.secondary";
                  const normalColor =
                    blips > 0 ? "success.main" : blips < 0 ? "error.main" : "text.secondary";
                  const effectColor = key === "r" || key === "w" ? invertedColor : normalColor;
                  const display = blips === 0 ? "0" : `${sign}${blips}`;
                  const resolvedColor =
                    effectColor === "success.main"
                      ? theme.palette.success.main
                      : effectColor === "error.main"
                        ? theme.palette.error.main
                        : theme.palette.text.secondary;
                  return (
                    <Box
                      component="span"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        minWidth: ARROW_COL_WIDTH,
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          width: ARROW_COL_WIDTH,
                          minWidth: ARROW_COL_WIDTH,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {blips > 0 && (
                          <EffectArrow direction="up" color={resolvedColor} />
                        )}
                        {blips < 0 && (
                          <EffectArrow direction="down" color={resolvedColor} />
                        )}
                      </Box>
                      <Typography
                        variant="body2"
                        component="span"
                        sx={{ fontWeight: 500, color: effectColor }}
                        aria-label={`Effect on ${label}: ${display} blips`}
                      >
                        {display}
                      </Typography>
                    </Box>
                  );
                })()}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
