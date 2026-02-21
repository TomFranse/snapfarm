import {createTheme} from '@mui/material/styles';
import type {Theme} from '@mui/material/styles';
import materialTheme from './material-theme-growfarm.json';

type SchemeKey = 'light' | 'dark';

interface MaterialScheme {
  readonly primary: string;
  readonly onPrimary: string;
  readonly secondary: string;
  readonly onSecondary: string;
  readonly tertiary?: string;
  readonly onTertiary?: string;
  readonly error: string;
  readonly onError: string;
  readonly background: string;
  readonly onBackground: string;
  readonly surface: string;
  readonly onSurface: string;
  readonly surfaceVariant?: string;
  readonly onSurfaceVariant?: string;
  readonly outline?: string;
  readonly outlineVariant?: string;
}

function schemeToMuiPalette(s: MaterialScheme, mode: SchemeKey) {
  return {
    mode,
    primary: {main: s.primary, contrastText: s.onPrimary},
    secondary: {main: s.secondary, contrastText: s.onSecondary},
    tertiary: {
      main: s.tertiary ?? '#FEFEFE',
      contrastText: s.onTertiary ?? '#000000',
    },
    error: {main: s.error, contrastText: s.onError},
    background: {default: s.background, paper: s.surface},
    text: {
      primary: s.onSurface,
      secondary: s.onSurfaceVariant ?? s.onSurface,
    },
    divider: s.outlineVariant ?? s.outline ?? s.onSurface,
  } as const;
}

export function createAppTheme(mode: SchemeKey): Theme {
  const scheme = (materialTheme.schemes as Record<string, MaterialScheme>)[mode];
  const palette = schemeToMuiPalette(scheme, mode);
  const extended = Object.fromEntries(
    (materialTheme.extendedColors as {name: string; color: string}[]).map(e => [e.name, e.color])
  );
  return createTheme({
    palette,
    // Expose extended colors (Earth, Water, Plant, etc.) on theme
    extended: {
      ...extended,
      Plant2: '#9FD69A',
      Grain2: '#F1D67E',
      Water2: '#9ABDD6',
      Grape2: '#D09AD6',
      // Requirement color tokens (app-wide)
      ReqTemperature: '#BA1A1A',
      ReqTemperature2: '#F5C1C1',
      // Mid red between ReqTemperature (too strong) and ReqTemperature2 (too light)
      ReqTemperatureWarn: '#E07A7A',
      ReqLight: '#E8B923',
      ReqLight2: '#F1D67E',
      ReqFertility: '#55B54A',
      ReqFertility2: '#9FD69A',
      ReqAcidity: '#AB4AB5',
      ReqAcidity2: '#D09AD6',
      ReqPorosity: '#B5754A',
      ReqPorosity2: '#D7B7A2',
    },
    shape: {borderRadius: 8},
    typography: {
      fontFamily: ['Montaga', 'Helvetica', 'Arial', 'sans-serif'].join(','),
      h1: {fontFamily: 'Montaga, Helvetica, Arial, sans-serif', fontWeight: 400},
      h2: {fontFamily: 'Montaga, Helvetica, Arial, sans-serif', fontWeight: 400},
      h3: {fontFamily: 'Montaga, Helvetica, Arial, sans-serif', fontWeight: 400},
      h4: {fontFamily: 'Montaga, Helvetica, Arial, sans-serif', fontWeight: 400},
      h5: {fontFamily: 'Montaga, Helvetica, Arial, sans-serif', fontWeight: 400},
      h6: {fontFamily: 'Montaga, Helvetica, Arial, sans-serif', fontWeight: 400},
    },
  });
}

export const lightTheme: Theme = createAppTheme('light');
export const darkTheme: Theme = createAppTheme('dark');

declare module '@mui/material/styles' {
  interface Theme {
    extended: Record<string, string>;
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    extended?: Record<string, string>;
  }
  // Add tertiary to the palette so it can be used consistently across components
  interface Palette {
    tertiary: Palette['primary'];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
  }
}

// Allow using color="tertiary" on common MUI components
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    tertiary: true;
  }
}
declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    tertiary: true;
  }
}
declare module '@mui/material/IconButton' {
  interface IconButtonPropsColorOverrides {
    tertiary: true;
  }
}



