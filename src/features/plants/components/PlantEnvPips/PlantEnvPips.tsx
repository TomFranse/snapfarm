/**
 * PlantEnvPips - Renders 9 environment variables (T, L, F, P, M, A, S, W, R) as 5 pips each.
 * Uses icons and semantic colors. Same fill logic as VariablePips (card game).
 */

import { Box, Divider, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { Plant, GlobalLimits, PlantEffects } from "../../types/plants.types";
import { ENV_COLORS, ENV_CONFIG } from "../../types/envConfig";

const COLS = 5;
const ARROW_SIZE = 12;
const ARROW_COL_WIDTH = 14;

type EffectKey = keyof PlantEffects;

function EffectArrow({ direction, color }: { direction: "up" | "down"; color: string }) {
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
          if (!optKey || !minKey || !maxKey) return null;
          const opt = plant[optKey as keyof Plant] as number | null | undefined;
          const gMin = String(limits[minKey as keyof GlobalLimits] ?? "");
          const gMax = String(limits[maxKey as keyof GlobalLimits] ?? "");
          const value = optToScale(opt, gMin, gMax);
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
                  const blips = toHalfBlip(deltaToBlips(delta, key, gMin, gMax));
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
                        {blips > 0 && <EffectArrow direction="up" color={resolvedColor} />}
                        {blips < 0 && <EffectArrow direction="down" color={resolvedColor} />}
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
