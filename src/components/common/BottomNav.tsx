/**
 * BottomNav - Fixed bottom navigation bar with score display.
 * Replaces Topbar per MUI mobile-first bottom navigation pattern.
 */

import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { ProfileMenu } from "@/components/common/ProfileMenu";
import { useGameContext } from "@features/card-game/context/GameProvider";

const HIDE_SIGN_IN = true;

export const BottomNav = () => {
  const { totalScore } = useGameContext();

  return (
    <AppBar
      position="fixed"
      sx={{
        top: "auto",
        bottom: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: (theme) => theme.spacing(7),
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="body1"
          component="span"
          sx={{ fontWeight: (theme) => theme.typography.fontWeightMedium }}
        >
          Score: {totalScore}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>{!HIDE_SIGN_IN && <ProfileMenu />}</Box>
      </Toolbar>
    </AppBar>
  );
};
