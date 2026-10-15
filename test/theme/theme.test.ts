import { describe, expect, test } from 'vitest';
import { VALID_THEME_MODES, VALID_THEME_PALETTES } from '../../src/theme/theme-storage.js';
import { createAppTheme, PALETTES, ThemeMode, ThemePalette } from '../../src/theme/theme.js';

function parseColor(color: string): [number, number, number, number] {
  if (color.startsWith('#')) {
    let hex = color.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('');
    }
    const num = parseInt(hex, 16);
    return [num >> 16, (num >> 8) & 255, num & 255, 1];
  }
  if (color.startsWith('rgba')) {
    const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)/);
    if (match) {
      return [
        parseInt(match[1], 10),
        parseInt(match[2], 10),
        parseInt(match[3], 10),
        parseFloat(match[4]),
      ];
    }
  }
  if (color.startsWith('rgb')) {
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10), 1];
    }
  }
  throw new Error(`Unsupported color format: ${color}`);
}

function channelLuminance(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function relativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
}

function contrastRatio(foreground: string, background: string): number {
  const [r1, g1, b1, a1] = parseColor(foreground);
  const [r2, g2, b2] = parseColor(background);
  const r = Math.round(r1 * a1 + r2 * (1 - a1));
  const g = Math.round(g1 * a1 + g2 * (1 - a1));
  const b = Math.round(b1 * a1 + b2 * (1 - a1));
  const l1 = relativeLuminance(r, g, b);
  const l2 = relativeLuminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('theme', () => {
  test('defines the 4 required palettes with primary and secondary colors', () => {
    expect(Object.keys(PALETTES)).toEqual(['default', 'forest', 'ocean', 'sunset']);
    for (const key of VALID_THEME_PALETTES) {
      expect(PALETTES[key]).toBeDefined();
      expect(PALETTES[key].name).toBeTruthy();
      expect(PALETTES[key].primary).toBeDefined();
      expect(PALETTES[key].secondary).toBeDefined();
    }
  });

  test('falls back to default Ocean theme when called without arguments', () => {
    const theme = createAppTheme();
    expect(theme.palette.mode).toBe('light');
    expect(theme.palette.primary.main).toBe(PALETTES.ocean.primary[500]);
  });

  test('falls back to ocean palette when an unknown palette is passed', () => {
    const theme = createAppTheme('light', 'unknown' as unknown as ThemePalette);
    expect(theme.palette.primary.main).toBe(PALETTES.ocean.primary[500]);
  });

  test('preserves semantic colors and Lexend typography', () => {
    const theme = createAppTheme('light', 'ocean');
    expect(theme.palette.error.main).toBe('#dc2626');
    expect(theme.palette.success.main).toBe('#16a34a');
    expect(theme.typography.fontFamily).toContain('Lexend');
    expect(theme.components?.MuiAppBar?.defaultProps?.enableColorOnDark).toBe(true);
  });

  describe('WCAG AA contrast assertions across all palettes and modes', () => {
    const modes: ThemeMode[] = [...VALID_THEME_MODES];
    const palettes: ThemePalette[] = [...VALID_THEME_PALETTES];

    for (const mode of modes) {
      for (const palette of palettes) {
        test(`palette ${palette} in ${mode} mode satisfies contrast >= 3:1 and button overrides`, () => {
          const theme = createAppTheme(mode, palette);

          // 1. Unselected label vs page background >= 3:1
          const unselectedColor = theme.palette.text.primary;
          const pageBg = theme.palette.background.default;
          const unselectedRatio = contrastRatio(unselectedColor, pageBg);
          expect(unselectedRatio).toBeGreaterThanOrEqual(3);

          // 2. Selected primary label vs primary fill >= 3:1
          const primaryLabel = theme.palette.primary.contrastText;
          const primaryFill = theme.palette.primary.main;
          const primaryRatio = contrastRatio(primaryLabel, primaryFill);
          expect(primaryRatio).toBeGreaterThanOrEqual(3);

          // 3. Selected secondary label vs secondary fill >= 3:1
          const secondaryLabel = theme.palette.secondary.contrastText;
          const secondaryFill = theme.palette.secondary.main;
          const secondaryRatio = contrastRatio(secondaryLabel, secondaryFill);
          expect(secondaryRatio).toBeGreaterThanOrEqual(3);

          // 4. Outlined buttons use primary text color by construction
          const outlinedOverride = theme.components?.MuiButton?.styleOverrides?.outlined as {
            borderColor: string;
            color: string;
          };
          expect(outlinedOverride).toBeDefined();
          expect(outlinedOverride.color).toBe(theme.palette.text.primary);
          expect(outlinedOverride.borderColor).toBeTruthy();
        });
      }
    }
  });
});
