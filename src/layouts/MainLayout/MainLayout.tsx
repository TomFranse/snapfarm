import { Outlet } from "react-router-dom";
import { Container, Box } from "@mui/material";

export const MainLayout = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* BottomNav handles app-level navigation (fixed at bottom) */}
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};
