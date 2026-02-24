/**
 * VariablePips - Renders 5 variables as a spiderweb/radar chart
 *
 * Pentagon layout: 5 axes (L, S, M, W, R), value 0–10 from center to edge.
 * Plant cards can use directional multi-axis fills. Effects are shown as
 * up/down triangle badges next to the axis icons.
 */

import { useId } from "react";
import { Box, useTheme } from "@mui/material";
import { CARD_ENV_CONFIG, ENV_COLORS } from "@features/plants/types/envConfig";
import type { CardVariables, EffectTuple } from "@features/card-game/types/cardGame.types";

const AXIS_COUNT = 5;
const DEG_PER_AXIS = 360 / AXIS_COUNT;
const START_ANGLE = -90;
const VIEW_SIZE = 100;
const CENTER = VIEW_SIZE / 2;
const MAX_RADIUS = 42;
const ICON_RADIUS = 46;
const ICON_DROP_SHADOW = "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.35))";

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function getAxisAngle(index: number): number {
  return START_ANGLE + index * DEG_PER_AXIS;
}

function polarToCartesian(opts: {
  cx: number;
  cy: number;
  r: number;
  angleDeg: number;
}): [number, number] {
  const { cx, cy, r, angleDeg } = opts;
  const rad = degToRad(angleDeg);
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function getPolygonPoints(values: CardVariables["values"]): string {
  return values
    .map((v, i) => {
      const clamped = Math.max(0, Math.min(10, v));
      const r = (clamped / 10) * MAX_RADIUS;
      const [x, y] = polarToCartesian({
        cx: CENTER,
        cy: CENTER,
        r,
        angleDeg: getAxisAngle(i),
      });
      return `${x},${y}`;
    })
    .join(" ");
}

function getEffectIndicatorColor(
  dir: "up" | "down",
  invertedEffect: boolean | undefined,
  theme: { palette: { success: { main: string }; error: { main: string } } }
): string {
  const upColor = invertedEffect === true ? theme.palette.error.main : theme.palette.success.main;
  const downColor = invertedEffect === true ? theme.palette.success.main : theme.palette.error.main;
  return dir === "up" ? upColor : downColor;
}

function RadarSvgContent({
  points,
  polygonFill,
  polygonOpacity,
  useDirectionalGradient,
  axisColors,
}: {
  points: string;
  polygonFill: string;
  polygonOpacity: number;
  useDirectionalGradient: boolean;
  axisColors: string[];
}) {
  const gradientBaseId = useId().replace(/:/g, "");
  const clipPathId = `${gradientBaseId}-radar-clip`;

  return (
    <Box
      component="svg"
      viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
      sx={{
        width: "100%",
        maxWidth: 96,
        height: "auto",
        aspectRatio: "1",
      }}
      aria-label="Variable radar chart"
    >
      {useDirectionalGradient ? (
        <>
          <defs>
            <clipPath id={clipPathId}>
              <polygon points={points} />
            </clipPath>
            {axisColors.map((color, i) => {
              const [cx, cy] = polarToCartesian({
                cx: CENTER,
                cy: CENTER,
                r: MAX_RADIUS,
                angleDeg: getAxisAngle(i),
              });
              return (
                <radialGradient
                  key={`${gradientBaseId}-axis-${CARD_ENV_CONFIG[i]?.key ?? i}`}
                  id={`${gradientBaseId}-axis-${i}`}
                  gradientUnits="userSpaceOnUse"
                  cx={cx}
                  cy={cy}
                  r={MAX_RADIUS * 1.2}
                >
                  <stop offset="0%" stopColor={color} stopOpacity={1} />
                  <stop offset="45%" stopColor={color} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </radialGradient>
              );
            })}
          </defs>

          <g clipPath={`url(#${clipPathId})`}>
            <polygon points={points} fill={polygonFill} fillOpacity={polygonOpacity} />
            {axisColors.map((_, i) => (
              <rect
                key={`${gradientBaseId}-overlay-${i}`}
                x={0}
                y={0}
                width={VIEW_SIZE}
                height={VIEW_SIZE}
                fill={`url(#${gradientBaseId}-axis-${i})`}
              />
            ))}
          </g>
        </>
      ) : (
        <polygon points={points} fill={polygonFill} fillOpacity={polygonOpacity} />
      )}
    </Box>
  );
}

function IconOverlay({
  effects,
  theme,
}: {
  effects?: EffectTuple;
  theme: { palette: { success: { main: string }; error: { main: string } } };
}) {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{ position: "relative", width: "100%", maxWidth: 96, aspectRatio: "1" }}>
        {CARD_ENV_CONFIG.map(({ key, Icon, label, invertedEffect }, i) => {
          const [x, y] = polarToCartesian({
            cx: CENTER,
            cy: CENTER,
            r: ICON_RADIUS,
            angleDeg: getAxisAngle(i),
          });
          const dir = effects?.[i];
          const effectColor =
            dir === "up" || dir === "down"
              ? getEffectIndicatorColor(dir, invertedEffect, theme)
              : undefined;
          const effectSymbol = dir === "up" ? "▲" : dir === "down" ? "▼" : null;
          const pctX = (x / VIEW_SIZE) * 100;
          const pctY = (y / VIEW_SIZE) * 100;
          return (
            <Box
              key={key}
              sx={{
                position: "absolute",
                left: `${pctX}%`,
                top: `${pctY}%`,
                transform: "translate(-50%, -50%)",
                color: "text.secondary",
                filter: ICON_DROP_SHADOW,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                sx={(t) => ({
                  fontSize: t.typography.body2.fontSize,
                  filter: ICON_DROP_SHADOW,
                })}
                aria-label={label}
              />
              {effectSymbol && (
                <Box
                  component="span"
                  sx={{
                    position: "absolute",
                    right: "-0.5em",
                    bottom: "-0.45em",
                    fontSize: "0.56rem",
                    fontWeight: 800,
                    lineHeight: 1,
                    color: effectColor,
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                    pointerEvents: "none",
                  }}
                >
                  {effectSymbol}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export interface VariablePipsProps {
  variables: CardVariables;
  effects?: EffectTuple;
  useDirectionalGradient?: boolean;
}

export function VariablePips({
  variables,
  effects,
  useDirectionalGradient = false,
}: VariablePipsProps) {
  const theme = useTheme();
  const polygonFill = theme.palette.text.secondary;
  const axisColors = CARD_ENV_CONFIG.map(
    ({ key }, i) => ENV_COLORS[key] ?? theme.palette.game.variableColors[i] ?? polygonFill
  );
  const points = getPolygonPoints(variables.values);

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        overflow: "visible",
      }}
    >
      <RadarSvgContent
        points={points}
        polygonFill={polygonFill}
        polygonOpacity={useDirectionalGradient ? 1 : 0.4}
        useDirectionalGradient={useDirectionalGradient}
        axisColors={axisColors}
      />
      <IconOverlay effects={effects} theme={theme} />
    </Box>
  );
}
