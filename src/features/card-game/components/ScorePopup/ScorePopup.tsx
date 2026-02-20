/**
 * ScorePopup - Animated score number that fades out above played slot
 */

import { Typography } from "@mui/material";

export interface ScorePopupProps {
  score: number;
}

export function ScorePopup({ score }: ScorePopupProps) {
  return (
    <Typography
      variant="h5"
      sx={{
        position: "absolute",
        top: -8,
        left: "50%",
        transform: "translateX(-50%)",
        fontWeight: 700,
        color: "primary.main",
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
