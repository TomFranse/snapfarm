import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { AuthProvider } from "@/shared/context/AuthContext";
import { GameProvider } from "@features/card-game/context/GameProvider";
import { BottomNav } from "@/components/common/BottomNav";
import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import { HomePage } from "@pages/HomePage";
import { PlantsPage } from "@pages/PlantsPage";
import { PlantDetailPage } from "@pages/PlantDetailPage";
import { SetupPage } from "@pages/SetupPage";
import { AuthCallbackPage } from "@pages/AuthCallbackPage";

const BOTTOM_NAV_HEIGHT = 56;

function AppContent() {
  return (
    <GameProvider>
      <Box
        sx={{
          pb: `${BOTTOM_NAV_HEIGHT}px`,
        }}
      >
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/plants" element={<PlantsPage />} />
            <Route path="/plants/:id" element={<PlantDetailPage />} />
          </Route>
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/setup" element={<SetupPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
      <BottomNav />
    </GameProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
