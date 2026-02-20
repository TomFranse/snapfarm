import { Link } from "react-router-dom";
import {
  Box,
  Container,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { usePlants } from "@features/plants/hooks/usePlants";
import { useGlobalLimits } from "@features/plants/hooks/useGlobalLimits";
import { GlobalSettingsSection } from "@features/plants/components/GlobalSettingsSection/GlobalSettingsSection";

export const PlantsPage = () => {
  const { plants, loading, error } = usePlants();
  const { limits, update, resetToDefaults, isCustom } = useGlobalLimits();

  const globalSettingsProps = {
    limits,
    onUpdate: update,
    onReset: resetToDefaults,
    isCustom,
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <GlobalSettingsSection {...globalSettingsProps} />
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <GlobalSettingsSection {...globalSettingsProps} />
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (plants.length === 0) {
    return (
      <Container maxWidth="sm">
        <GlobalSettingsSection {...globalSettingsProps} />
        <Typography variant="body1" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
          No plants found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <GlobalSettingsSection {...globalSettingsProps} />
      <Typography variant="h6" component="h1" sx={{ mb: 2 }}>
        Plants
      </Typography>
      <List>
        {plants.map((plant) => (
          <ListItemButton key={plant.id} component={Link} to={`/plants/${plant.id}`}>
            <ListItemText
              primary={plant.type || plant.id}
              secondary={plant.description ?? undefined}
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </ListItemButton>
        ))}
      </List>
    </Container>
  );
};
