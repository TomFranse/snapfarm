/**
 * ScorePopup - Animated score number that fades out above played slot
 * Color: 0 = red, 45 = orange/brown, 70 = yellow with glow
 */

import { Typography, useTheme } from "@mui/material";

export interface ScorePopupProps {
  score: number;
}

function lerpHex(a: string, b: string, t: number): string {
  const parse = (hex: string) => ({
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  });
  const ca = parse(a);
  const cb = parse(b);
  const r = Math.round(ca.r + (cb.r - ca.r) * t);
  const g = Math.round(ca.g + (cb.g - ca.g) * t);
  const bl = Math.round(ca.b + (cb.b - ca.b) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl.toString(16).padStart(2, "0")}`;
}

function getScoreColor(score: number, colors: { low: string; mid: string; high: string }): string {
  const { low, mid, high } = colors;
  if (score <= 0) return low;
  if (score >= 70) return high;
  if (score <= 45) {
    const t = score / 45;
    return lerpHex(low, mid, t);
  }
  const t = (score - 45) / (70 - 45);
  return lerpHex(mid, high, t);
}

const DEFAULT_SCORE_COLORS = { low: "#BA1A1A", mid: "#B5754A", high: "#E8B923" };

export function ScorePopup({ score }: ScorePopupProps) {
  const theme = useTheme();
  const colors = theme.palette.score ?? DEFAULT_SCORE_COLORS;
  const color = getScoreColor(score, colors);
  const hasGlow = score >= 70;

  return (
    <Typography
      variant="h5"
      sx={{
        position: "absolute",
        top: -8,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        fontWeight: 700,
        color,
        ...(hasGlow && {
          textShadow: `0 0 8px ${color}, 0 0 16px ${color}, 0 0 24px ${color}`,
        }),
        animation: "scoreFadeOut 1.5s ease-out forwards",
        "@keyframes scoreFadeOut": {
          "0%": { opacity: 1, transform: "translateX(-50%) translateY(0)" },
          "100%": { opacity: 0, transform: "translateX(-50%) translateY(-20px)" },
        },
      }}
    >
      +{score}
    </Typography>
  );
}
