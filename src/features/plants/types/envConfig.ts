/**
 * Shared environment variable config for PlantEnvPips and card game VariablePips.
 * Defines icons, labels, colors, and effect semantics per variable.
 */

import ThermostatIcon from "@mui/icons-material/Thermostat";
import LightModeIcon from "@mui/icons-material/LightMode";
import GrassIcon from "@mui/icons-material/Grass";
import GrainIcon from "@mui/icons-material/Grain";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import ScienceIcon from "@mui/icons-material/Science";
import LandscapeIcon from "@mui/icons-material/Landscape";
import AirIcon from "@mui/icons-material/Air";
import BugReportIcon from "@mui/icons-material/BugReport";
import type { SvgIconComponent } from "@mui/icons-material";

/** Semantic colors for each env variable */
export const ENV_COLORS: Record<string, string> = {
  t: "#B5754A", // Temperature - warm orange
  l: "#E8B923", // Light - yellow/gold
  f: "#54B54A", // Fertility - green
  p: "#8B7355", // Porosity - earth brown
  m: "#4A8AB5", // Moisture - blue
  a: "#AB4AB5", // Acidity - purple
  s: "#6B4423", // Soil - dark earth brown
  w: "#87CEEB", // Wind - sky blue
  r: "#C45C4A", // Pest resistance - red/orange
};

export interface EnvConfigItem {
  key: string;
  Icon: SvgIconComponent;
  label: string;
  /** Shorter label for compact card display */
  shortLabel?: string;
  optKey?: string;
  minKey?: string;
  maxKey?: string;
  /** For effect arrows: inverted means up=error, down=success (e.g. Pest, Wind) */
  invertedEffect?: boolean;
}

/** Order: Basic: Light, Soil, Moisture, Wind, Pest | Advanced: Temperature, Fertility, Porosity, Acidity */
export const ENV_CONFIG: EnvConfigItem[] = [
  {
    key: "l",
    optKey: "l_opt",
    minKey: "l_min",
    maxKey: "l_max",
    Icon: LightModeIcon,
    label: "Light",
  },
  {
    key: "s",
    optKey: "s_opt",
    minKey: "s_min",
    maxKey: "s_max",
    Icon: LandscapeIcon,
    label: "Soil",
  },
  {
    key: "m",
    optKey: "m_opt",
    minKey: "m_min",
    maxKey: "m_max",
    Icon: WaterDropIcon,
    label: "Moisture",
    shortLabel: "Moist",
  },
  {
    key: "w",
    optKey: "w_opt",
    minKey: "w_min",
    maxKey: "w_max",
    Icon: AirIcon,
    label: "Wind resistance",
    shortLabel: "Wind",
    invertedEffect: true,
  },
  {
    key: "r",
    optKey: "r_opt",
    minKey: "r_min",
    maxKey: "r_max",
    Icon: BugReportIcon,
    label: "Pest resistance",
    shortLabel: "Pest",
    invertedEffect: true,
  },
  {
    key: "t",
    optKey: "t_opt",
    minKey: "t_min",
    maxKey: "t_max",
    Icon: ThermostatIcon,
    label: "Temperature",
    shortLabel: "Temp",
  },
  {
    key: "f",
    optKey: "f_opt",
    minKey: "f_min",
    maxKey: "f_max",
    Icon: GrassIcon,
    label: "Fertility",
    shortLabel: "Fert",
  },
  {
    key: "p",
    optKey: "p_opt",
    minKey: "p_min",
    maxKey: "p_max",
    Icon: GrainIcon,
    label: "Porosity",
  },
  {
    key: "a",
    optKey: "a_opt",
    minKey: "a_min",
    maxKey: "a_max",
    Icon: ScienceIcon,
    label: "Acidity",
  },
];

/** First 5 variables for card game: L, S, M, W, R */
export const CARD_ENV_CONFIG = ENV_CONFIG.slice(0, 5);
