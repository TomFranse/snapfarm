import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  TextField,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RestoreIcon from "@mui/icons-material/Restore";
import type { GlobalLimits } from "@features/plants/types/plants.types";

const FIELDS: { key: keyof GlobalLimits; label: string }[] = [
  { key: "t_min", label: "T min" },
  { key: "t_max", label: "T max" },
  { key: "l_min", label: "L min" },
  { key: "l_max", label: "L max" },
  { key: "f_min", label: "F min" },
  { key: "f_max", label: "F max" },
  { key: "p_min", label: "P min" },
  { key: "p_max", label: "P max" },
  { key: "m_min", label: "M min" },
  { key: "m_max", label: "M max" },
  { key: "a_min", label: "A min" },
  { key: "a_max", label: "A max" },
];

export interface GlobalSettingsSectionProps {
  limits: GlobalLimits;
  onUpdate: (next: Partial<GlobalLimits>) => void;
  onReset: () => void;
  isCustom: boolean;
}

export const GlobalSettingsSection = ({
  limits,
  onUpdate,
  onReset,
  isCustom,
}: GlobalSettingsSectionProps) => {
  const [local, setLocal] = useState<GlobalLimits>(limits);

  useEffect(() => {
    setLocal(limits);
  }, [limits]);

  const handleChange = (key: keyof GlobalLimits, value: string) => {
    const next = { ...local, [key]: value };
    setLocal(next);
    onUpdate({ [key]: value });
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <Accordion defaultExpanded={false} sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1" fontWeight={500}>
          Global limits
        </Typography>
        {isCustom && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1, alignSelf: "center" }}>
            (custom)
          </Typography>
        )}
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: 2,
            }}
          >
            {FIELDS.map(({ key, label }) => (
              <TextField
                key={key}
                size="small"
                label={label}
                value={local[key] as string}
                onChange={(e) => handleChange(key, e.target.value)}
                fullWidth
              />
            ))}
          </Box>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RestoreIcon />}
            onClick={handleReset}
            sx={{ alignSelf: "flex-start" }}
          >
            Reset to defaults
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
