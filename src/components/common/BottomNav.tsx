/**
 * BottomNav - Fixed bottom navigation bar with score display.
 * Replaces Topbar per MUI mobile-first bottom navigation pattern.
 */

import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import GrassIcon from "@mui/icons-material/Grass";
import { ProfileMenu } from "@/components/common/ProfileMenu";
import { useGameContext } from "@features/card-game/context/GameProvider";

const HIDE_SIGN_IN = true;

export const BottomNav = () => {
  const { totalScore } = useGameContext();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isPlants = location.pathname.startsWith("/plants");

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton
            component={Link}
            to="/"
            color={isHome ? "primary" : "inherit"}
            aria-label="Home"
          >
            <HomeIcon />
          </IconButton>
          <IconButton
            component={Link}
            to="/plants"
            color={isPlants ? "primary" : "inherit"}
            aria-label="Plants"
          >
            <GrassIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>{!HIDE_SIGN_IN && <ProfileMenu />}</Box>
      </Toolbar>
    </AppBar>
  );
};
