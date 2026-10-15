import { ThemeMode, ThemePalette } from './theme.js';

export interface StoredTheme {
  readonly themeMode: ThemeMode;
  readonly themePalette: ThemePalette;
}

export const DEFAULT_THEME_MODE: ThemeMode = 'light';
export const DEFAULT_THEME_PALETTE: ThemePalette = 'ocean';
export const THEME_STORAGE_KEY = 'learn.theme';

export const VALID_THEME_MODES: readonly ThemeMode[] = ['light', 'dark'];
export const VALID_THEME_PALETTES: readonly ThemePalette[] = [
  'default',
  'ocean',
  'sunset',
  'forest',
];

export const isValidThemeMode = (value: unknown): value is ThemeMode =>
  typeof value === 'string' && (VALID_THEME_MODES as readonly string[]).includes(value);

export const isValidThemePalette = (value: unknown): value is ThemePalette =>
  typeof value === 'string' && (VALID_THEME_PALETTES as readonly string[]).includes(value);

export const getStoredTheme = (): StoredTheme => {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) {
      return {
        themeMode: DEFAULT_THEME_MODE,
        themePalette: DEFAULT_THEME_PALETTE,
      };
    }
    const parsed = JSON.parse(raw) as Partial<StoredTheme>;
    const themeMode = isValidThemeMode(parsed?.themeMode) ? parsed.themeMode : DEFAULT_THEME_MODE;
    const themePalette = isValidThemePalette(parsed?.themePalette)
      ? parsed.themePalette
      : DEFAULT_THEME_PALETTE;
    return {
      themeMode,
      themePalette,
    };
  } catch {
    return {
      themeMode: DEFAULT_THEME_MODE,
      themePalette: DEFAULT_THEME_PALETTE,
    };
  }
};

export const setStoredTheme = (theme: StoredTheme): void => {
  try {
    localStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify({
        themeMode: theme.themeMode,
        themePalette: theme.themePalette,
      }),
    );
  } catch {
    // Ignore localStorage errors (private-mode or quota exceeded)
  }
};
