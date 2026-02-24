import { Outlet } from "react-router-dom";
import { Container, Box } from "@mui/material";

const BOTTOM_NAV_HEIGHT = 56;

export const MainLayout = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: `calc(100dvh - ${BOTTOM_NAV_HEIGHT}px)`,
      }}
    >
      {/* BottomNav handles app-level navigation (fixed at bottom) */}
      <Container component="main" sx={{ flex: 1, py: 2, display: "flex", overflow: "auto" }}>
        <Outlet />
      </Container>
    </Box>
  );
};
