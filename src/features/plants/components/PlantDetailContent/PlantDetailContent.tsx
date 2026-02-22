import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Button,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import type { Plant, GlobalLimits } from "../../types/plants.types";
import type { PlantImageWithUrl } from "../../types/plantImages.types";
import { PlantEnvPips } from "../PlantEnvPips/PlantEnvPips";

const IMAGE_TAGS = ["small", "medium", "large", "dying"] as const;

const formatMs = (ms: number | null | undefined): string => {
  if (ms === null || ms === undefined) return "";
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)} s`;
  return `${ms} ms`;
};

const EnvRow = ({
  label,
  min,
  opt,
  max,
}: {
  label: string;
  min?: number | null;
  opt?: number | null;
  max?: number | null;
}) => {
  const parts = [min, opt, max].filter((v) => v !== null && v !== undefined);
  const secondary = parts.length > 0 ? parts.join(" / ") : "—";
  return (
    <ListItem dense disablePadding>
      <ListItemText primary={label} secondary={secondary} />
    </ListItem>
  );
};

const BasicSection = ({ plant }: { plant: Plant }) => {
  if (plant.status === null && plant.price === null) return null;
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Basic
      </Typography>
      <List dense disablePadding>
        {plant.status !== null && (
          <ListItem dense disablePadding>
            <ListItemText primary="Status" secondary={plant.status} />
          </ListItem>
        )}
        {plant.price !== null && (
          <ListItem dense disablePadding>
            <ListItemText primary="Price" secondary={plant.price} />
          </ListItem>
        )}
      </List>
    </Box>
  );
};

const EnvironmentSection = ({ plant }: { plant: Plant }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
      Environment
    </Typography>
    <List dense disablePadding>
      <EnvRow label="Light (L)" min={plant.l_min} opt={plant.l_opt} max={plant.l_max} />
      <EnvRow label="Soil (S)" min={undefined} opt={plant.s_opt} max={undefined} />
      <EnvRow label="Moisture (M)" min={plant.m_min} opt={plant.m_opt} max={plant.m_max} />
      <EnvRow label="Wind resistance (W)" min={undefined} opt={plant.w_opt} max={undefined} />
      <EnvRow label="Pest resistance (R)" min={undefined} opt={plant.r_opt} max={undefined} />
      <Divider sx={{ my: 1 }} component="li" />
      <EnvRow label="Temperature (T)" min={plant.t_min} opt={plant.t_opt} max={plant.t_max} />
      <EnvRow label="Fertility (F)" min={plant.f_min} opt={plant.f_opt} max={plant.f_max} />
      <EnvRow label="Porosity (P)" min={plant.p_min} opt={plant.p_opt} max={plant.p_max} />
      <EnvRow label="Acidity (A)" min={plant.a_min} opt={plant.a_opt} max={plant.a_max} />
    </List>
  </Box>
);

const TimingSection = ({ plant }: { plant: Plant }) => {
  const hasTiming =
    plant.establish_ms !== null ||
    plant.flowering_ms !== null ||
    plant.rest_ms !== null ||
    plant.yield_ms !== null ||
    plant.lifespan_ms !== null;
  if (!hasTiming) return null;
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Timing
      </Typography>
      <List dense disablePadding>
        {plant.establish_ms !== null && (
          <ListItem dense disablePadding>
            <ListItemText primary="Establish" secondary={formatMs(plant.establish_ms)} />
          </ListItem>
        )}
        {plant.flowering_ms !== null && (
          <ListItem dense disablePadding>
            <ListItemText primary="Flowering" secondary={formatMs(plant.flowering_ms)} />
          </ListItem>
        )}
        {plant.rest_ms !== null && (
          <ListItem dense disablePadding>
            <ListItemText primary="Rest" secondary={formatMs(plant.rest_ms)} />
          </ListItem>
        )}
        {plant.yield_ms !== null && (
          <ListItem dense disablePadding>
            <ListItemText primary="Yield" secondary={formatMs(plant.yield_ms)} />
          </ListItem>
        )}
        {plant.lifespan_ms !== null && (
          <ListItem dense disablePadding>
            <ListItemText primary="Lifespan" secondary={formatMs(plant.lifespan_ms)} />
          </ListItem>
        )}
      </List>
    </Box>
  );
};

const ImagesSection = ({
  images,
  loading,
  error,
  onUpload,
  onRemove,
}: {
  images: PlantImageWithUrl[];
  loading: boolean;
  error: string | null;
  onUpload: (tag: string, file: File) => Promise<unknown>;
  onRemove: (tag: string) => Promise<unknown>;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tag, setTag] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleSelectFile = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !tag) return;
    e.target.value = "";
    setUploadError(null);
    setUploading(true);
    try {
      await onUpload(tag, file);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (imgTag: string) => {
    try {
      await onRemove(imgTag);
    } catch {
      // Error surfaced via imagesError
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Images
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "flex-start", mb: 1 }}>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Tag</InputLabel>
          <Select value={tag} label="Tag" onChange={(e) => setTag(e.target.value)}>
            <MenuItem value="">
              <em>Select...</em>
            </MenuItem>
            {IMAGE_TAGS.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          size="small"
          startIcon={uploading ? <CircularProgress size={16} /> : <AddPhotoAlternateIcon />}
          onClick={handleSelectFile}
          disabled={!tag || loading || uploading}
        >
          Upload
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </Box>
      {(error || uploadError) && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {error ?? uploadError}
        </Alert>
      )}
      {loading && images.length === 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      {images.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {images.map((img) => (
            <Box key={img.id} sx={{ textAlign: "center" }}>
              <Box sx={{ position: "relative" }}>
                <Box
                  component="img"
                  src={img.public_url}
                  alt={img.tag}
                  sx={{
                    width: (theme) => theme.spacing(6),
                    height: (theme) => theme.spacing(6),
                    objectFit: "cover",
                    borderRadius: (theme) => theme.shape.borderRadius,
                    border: 1,
                    borderColor: "divider",
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemove(img.tag)}
                  sx={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    bgcolor: "background.paper",
                    boxShadow: 1,
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                  aria-label={`Delete ${img.tag}`}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="caption" display="block">
                {img.tag}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

interface PlantDetailContentProps {
  plant: Plant;
  limits: GlobalLimits;
  images: PlantImageWithUrl[];
  imagesLoading: boolean;
  imagesError: string | null;
  onUpload: (tag: string, file: File) => Promise<unknown>;
  onRemove: (tag: string) => Promise<unknown>;
}

export const PlantDetailContent = ({
  plant,
  limits,
  images,
  imagesLoading,
  imagesError,
  onUpload,
  onRemove,
}: PlantDetailContentProps) => (
  <Box>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
      <IconButton component={Link} to="/plants" size="small">
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h6" component="h1">
        {plant.type || plant.id}
      </Typography>
    </Box>
    {plant.description && (
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {plant.description}
      </Typography>
    )}
    <PlantEnvPips plant={plant} limits={limits} />
    <BasicSection plant={plant} />
    <EnvironmentSection plant={plant} />
    <TimingSection plant={plant} />
    <ImagesSection
      images={images}
      loading={imagesLoading}
      error={imagesError}
      onUpload={onUpload}
      onRemove={onRemove}
    />
  </Box>
);
