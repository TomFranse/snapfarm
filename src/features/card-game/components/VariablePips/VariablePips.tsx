/**
 * VariablePips - Renders 5 variables as a spiderweb/radar chart
 *
 * Pentagon layout: 5 axes (L, S, M, W, R), value 0–10 from center to edge.
 * Single-color filled polygon. Effects shown as chevrons at perimeter:
 * up = outward, down = inward. Icons at outer edge.
 */

import { Box, useTheme } from "@mui/material";
import { CARD_ENV_CONFIG } from "@features/plants/constants/envConfig";
import type { CardVariables, EffectTuple } from "@features/card-game/types/cardGame.types";

const AXIS_COUNT = 5;
const DEG_PER_AXIS = 360 / AXIS_COUNT;
const START_ANGLE = -90;
const VIEW_SIZE = 100;
const CENTER = VIEW_SIZE / 2;
const MAX_RADIUS = 42;
const ICON_RADIUS = 46;
const CHEVRON_RADIUS = 34;
const CHEVRON_SIZE = 5;

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

function getChevronColor(
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
  effects,
  polygonFill,
  polygonOpacity,
  theme,
}: {
  points: string;
  effects?: EffectTuple;
  polygonFill: string;
  polygonOpacity: number;
  theme: { palette: { success: { main: string }; error: { main: string } } };
}) {
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
      <polygon points={points} fill={polygonFill} fillOpacity={polygonOpacity} />
      {CARD_ENV_CONFIG.map(({ key, invertedEffect }, i) => {
        const angle = getAxisAngle(i);
        const [chevronX, chevronY] = polarToCartesian({
          cx: CENTER,
          cy: CENTER,
          r: CHEVRON_RADIUS,
          angleDeg: angle,
        });
        const dir = effects?.[i];
        const chevronColor =
          dir === "up" || dir === "down"
            ? getChevronColor(dir, invertedEffect, theme)
            : "transparent";
        const chevronRotation = dir === "up" ? angle + 180 : dir === "down" ? angle : 0;

        return (
          dir &&
          dir !== "neutral" && (
            <g
              key={key}
              transform={`translate(${chevronX}, ${chevronY}) rotate(${chevronRotation})`}
            >
              <path
                d={`M ${CHEVRON_SIZE},-${CHEVRON_SIZE / 2} L 0,0 L ${CHEVRON_SIZE},${CHEVRON_SIZE / 2}`}
                fill="none"
                stroke={chevronColor}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )
        );
      })}
    </Box>
  );
}

function IconOverlay() {
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
        {CARD_ENV_CONFIG.map(({ key, Icon, label }, i) => {
          const [x, y] = polarToCartesian({
            cx: CENTER,
            cy: CENTER,
            r: ICON_RADIUS,
            angleDeg: getAxisAngle(i),
          });
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon sx={(t) => ({ fontSize: t.typography.body2.fontSize })} aria-label={label} />
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
}

export function VariablePips({ variables, effects }: VariablePipsProps) {
  const theme = useTheme();
  const polygonFill = theme.palette.text.secondary;
  const points = getPolygonPoints(variables.values);

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <RadarSvgContent
        points={points}
        effects={effects}
        polygonFill={polygonFill}
        polygonOpacity={0.4}
        theme={theme}
      />
      <IconOverlay />
    </Box>
  );
}
