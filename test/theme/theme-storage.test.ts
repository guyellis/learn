import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  DEFAULT_THEME_MODE,
  DEFAULT_THEME_PALETTE,
  getStoredTheme,
  isValidThemeMode,
  isValidThemePalette,
  setStoredTheme,
  THEME_STORAGE_KEY,
  VALID_THEME_MODES,
  VALID_THEME_PALETTES,
} from '../../src/theme/theme-storage.js';

describe('theme-storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('constants and validators', () => {
    test('defines expected constants', () => {
      expect(DEFAULT_THEME_MODE).toBe('light');
      expect(DEFAULT_THEME_PALETTE).toBe('ocean');
      expect(THEME_STORAGE_KEY).toBe('learn.theme');
      expect(VALID_THEME_MODES).toEqual(['light', 'dark']);
      expect(VALID_THEME_PALETTES).toEqual(['default', 'ocean', 'sunset', 'forest']);
    });

    test('isValidThemeMode correctly validates theme mode values', () => {
      expect(isValidThemeMode('light')).toBe(true);
      expect(isValidThemeMode('dark')).toBe(true);
      expect(isValidThemeMode('dim')).toBe(false);
      expect(isValidThemeMode(null)).toBe(false);
      expect(isValidThemeMode(undefined)).toBe(false);
      expect(isValidThemeMode(123)).toBe(false);
      expect(isValidThemeMode({})).toBe(false);
    });

    test('isValidThemePalette correctly validates theme palette values', () => {
      expect(isValidThemePalette('default')).toBe(true);
      expect(isValidThemePalette('ocean')).toBe(true);
      expect(isValidThemePalette('sunset')).toBe(true);
      expect(isValidThemePalette('forest')).toBe(true);
      expect(isValidThemePalette('neon')).toBe(false);
      expect(isValidThemePalette(null)).toBe(false);
      expect(isValidThemePalette(undefined)).toBe(false);
      expect(isValidThemePalette(true)).toBe(false);
      expect(isValidThemePalette([])).toBe(false);
    });
  });

  describe('getStoredTheme', () => {
    test('returns default theme when localStorage item is not set', () => {
      expect(getStoredTheme()).toEqual({
        themeMode: 'light',
        themePalette: 'ocean',
      });
    });

    test('returns parsed stored theme when valid values exist', () => {
      localStorage.setItem(
        THEME_STORAGE_KEY,
        JSON.stringify({
          themeMode: 'dark',
          themePalette: 'forest',
        }),
      );

      expect(getStoredTheme()).toEqual({
        themeMode: 'dark',
        themePalette: 'forest',
      });
    });

    test('falls back to default mode when stored themeMode is invalid', () => {
      localStorage.setItem(
        THEME_STORAGE_KEY,
        JSON.stringify({
          themeMode: 'invalid-mode',
          themePalette: 'sunset',
        }),
      );

      expect(getStoredTheme()).toEqual({
        themeMode: 'light',
        themePalette: 'sunset',
      });
    });

    test('falls back to default palette when stored themePalette is invalid', () => {
      localStorage.setItem(
        THEME_STORAGE_KEY,
        JSON.stringify({
          themeMode: 'dark',
          themePalette: 'invalid-palette',
        }),
      );

      expect(getStoredTheme()).toEqual({
        themeMode: 'dark',
        themePalette: 'ocean',
      });
    });

    test('falls back to default theme when stored value is invalid JSON', () => {
      localStorage.setItem(THEME_STORAGE_KEY, 'not-valid-json{');

      expect(getStoredTheme()).toEqual({
        themeMode: 'light',
        themePalette: 'ocean',
      });
    });

    test('falls back to default theme when localStorage.getItem throws an error', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Access denied');
      });

      expect(getStoredTheme()).toEqual({
        themeMode: 'light',
        themePalette: 'ocean',
      });
    });
  });

  describe('setStoredTheme', () => {
    test('writes valid theme to localStorage', () => {
      setStoredTheme({
        themeMode: 'dark',
        themePalette: 'forest',
      });

      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored as string)).toEqual({
        themeMode: 'dark',
        themePalette: 'forest',
      });
    });

    test('handles localStorage.setItem throwing without re-throwing', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Quota exceeded');
      });

      expect(() => {
        setStoredTheme({
          themeMode: 'dark',
          themePalette: 'ocean',
        });
      }).not.toThrow();
    });
  });
});
