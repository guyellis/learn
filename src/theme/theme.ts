import { Color } from '@mui/material';
import { amber, blue, cyan, deepOrange, green, lime, teal } from '@mui/material/colors';
import { createTheme, Theme } from '@mui/material/styles';

export type ThemeMode = 'light' | 'dark';
export type ThemePalette = 'default' | 'ocean' | 'sunset' | 'forest';

export interface PalettePair {
  readonly name: string;
  readonly primary: Color;
  readonly secondary: Color;
}

export const PALETTES: Record<ThemePalette, PalettePair> = {
  default: {
    name: 'Default',
    primary: cyan,
    secondary: deepOrange,
  },
  forest: {
    name: 'Forest',
    primary: green,
    secondary: lime,
  },
  ocean: {
    name: 'Ocean',
    primary: blue,
    secondary: teal,
  },
  sunset: {
    name: 'Sunset',
    primary: deepOrange,
    secondary: amber,
  },
};

export const createAppTheme = (
  mode: ThemeMode = 'light',
  paletteName: ThemePalette = 'ocean',
): Theme => {
  const selectedPalette = PALETTES[paletteName] ?? PALETTES.ocean;
  const isDark = mode === 'dark';
  const textPrimary = isDark ? '#fff' : 'rgba(0, 0, 0, 0.87)';
  const outlinedBorder = isDark ? 'rgba(255, 255, 255, 0.36)' : 'rgba(0, 0, 0, 0.36)';

  return createTheme({
    components: {
      MuiAppBar: {
        defaultProps: {
          enableColorOnDark: true,
        },
      },
      MuiButton: {
        styleOverrides: {
          outlined: {
            borderColor: outlinedBorder,
            color: textPrimary,
          },
        },
      },
    },
    palette: {
      ...(isDark
        ? {}
        : {
            background: {
              default: '#f8fafc',
              paper: '#ffffff',
            },
          }),
      error: {
        main: '#dc2626',
      },
      mode: isDark ? 'dark' : 'light',
      primary: selectedPalette.primary,
      secondary: selectedPalette.secondary,
      success: {
        main: '#16a34a',
      },
    },
    typography: {
      body1: {
        fontSize: '1rem',
        letterSpacing: '0.01em',
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.925rem',
        letterSpacing: '0.01em',
        lineHeight: 1.5,
      },
      button: {
        fontWeight: 500,
        letterSpacing: '0.02em',
      },
      fontFamily:
        '"Lexend", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      fontSize: 16,
      fontWeightBold: 700,
      fontWeightLight: 300,
      fontWeightMedium: 500,
      fontWeightRegular: 400,
      h1: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 600,
        letterSpacing: '-0.005em',
        lineHeight: 1.25,
      },
      h3: {
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h4: {
        fontWeight: 500,
        lineHeight: 1.35,
      },
      h5: {
        fontWeight: 500,
        lineHeight: 1.4,
      },
      h6: {
        fontWeight: 500,
        lineHeight: 1.45,
      },
      htmlFontSize: 16,
      subtitle1: {
        fontSize: '1.05rem',
        letterSpacing: '0.01em',
        lineHeight: 1.5,
      },
      subtitle2: {
        fontSize: '0.925rem',
        letterSpacing: '0.01em',
        lineHeight: 1.5,
      },
    },
  });
};
