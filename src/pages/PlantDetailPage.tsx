import { useParams, Link } from "react-router-dom";
import { Container, Box, CircularProgress, Alert, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { usePlantDetail } from "@features/plants/hooks/usePlantDetail";
import { usePlantImages } from "@features/plants/hooks/usePlantImages";
import { useGlobalLimits } from "@features/plants/hooks/useGlobalLimits";
import { PlantDetailContent } from "@features/plants/components/PlantDetailContent/PlantDetailContent";

export const PlantDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { plant, loading, error } = usePlantDetail(id);
  const { limits } = useGlobalLimits();
  const {
    images,
    loading: imagesLoading,
    error: imagesError,
    upload,
    remove,
  } = usePlantImages(id ?? null);

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !plant) {
    return (
      <Container maxWidth="sm">
        <IconButton component={Link} to="/plants" sx={{ mb: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Alert severity="error">{error ?? "Plant not found"}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <PlantDetailContent
        plant={plant}
        limits={limits}
        images={images}
        imagesLoading={imagesLoading}
        imagesError={imagesError}
        onUpload={upload}
        onRemove={remove}
      />
    </Container>
  );
};
