import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  DEFAULT_THEME_MODE,
  DEFAULT_THEME_PALETTE,
  getStoredTheme,
  setStoredTheme,
} from './theme-storage.js';
import { createAppTheme, ThemeMode, ThemePalette } from './theme.js';

export interface AppThemeContextValue {
  readonly setThemeMode: (mode: ThemeMode) => void;
  readonly setThemePalette: (palette: ThemePalette) => void;
  readonly themeMode: ThemeMode;
  readonly themePalette: ThemePalette;
}

export const AppThemeContext = createContext<AppThemeContextValue>({
  setThemeMode: () => {},
  setThemePalette: () => {},
  themeMode: DEFAULT_THEME_MODE,
  themePalette: DEFAULT_THEME_PALETTE,
});

export const useAppTheme = (): AppThemeContextValue => useContext(AppThemeContext);

export interface AppThemeProviderProps {
  children: React.ReactNode;
  initialMode?: ThemeMode;
  initialPalette?: ThemePalette;
}

export function AppThemeProvider({
  children,
  initialMode,
  initialPalette,
}: AppThemeProviderProps): React.JSX.Element {
  const [themeState, setThemeState] = useState(() => {
    const stored = getStoredTheme();
    return {
      themeMode: initialMode ?? stored.themeMode,
      themePalette: initialPalette ?? stored.themePalette,
    };
  });

  const setThemeMode = (mode: ThemeMode) => {
    setThemeState((prev) => {
      const updated = { ...prev, themeMode: mode };
      setStoredTheme(updated);
      return updated;
    });
  };

  const setThemePalette = (palette: ThemePalette) => {
    setThemeState((prev) => {
      const updated = { ...prev, themePalette: palette };
      setStoredTheme(updated);
      return updated;
    });
  };

  const contextValue = useMemo(
    () => ({
      setThemeMode,
      setThemePalette,
      themeMode: themeState.themeMode,
      themePalette: themeState.themePalette,
    }),
    [themeState.themeMode, themeState.themePalette],
  );

  const theme = useMemo(
    () => createAppTheme(themeState.themeMode, themeState.themePalette),
    [themeState.themeMode, themeState.themePalette],
  );

  return (
    <AppThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppThemeContext.Provider>
  );
}
