import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { AppThemeProvider, useAppTheme } from '../../src/theme/app-theme-provider.js';
import { THEME_STORAGE_KEY } from '../../src/theme/theme-storage.js';

function TestConsumer() {
  const { setThemeMode, setThemePalette, themeMode, themePalette } = useAppTheme();

  return (
    <div>
      <span data-testid="mode">{themeMode}</span>
      <span data-testid="palette">{themePalette}</span>
      <button onClick={() => setThemeMode('dark')} type="button">
        Set Dark
      </button>
      <button onClick={() => setThemePalette('sunset')} type="button">
        Set Sunset
      </button>
    </div>
  );
}

describe('AppThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  test('provides default theme values when storage is empty', () => {
    render(
      <AppThemeProvider>
        <TestConsumer />
      </AppThemeProvider>,
    );

    expect(screen.getByTestId('mode').textContent).toBe('light');
    expect(screen.getByTestId('palette').textContent).toBe('ocean');
  });

  test('reads stored theme from localStorage on initial render', () => {
    localStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify({ themeMode: 'dark', themePalette: 'forest' }),
    );

    render(
      <AppThemeProvider>
        <TestConsumer />
      </AppThemeProvider>,
    );

    expect(screen.getByTestId('mode').textContent).toBe('dark');
    expect(screen.getByTestId('palette').textContent).toBe('forest');
  });

  test('respects initialMode and initialPalette props', () => {
    render(
      <AppThemeProvider initialMode="dark" initialPalette="sunset">
        <TestConsumer />
      </AppThemeProvider>,
    );

    expect(screen.getByTestId('mode').textContent).toBe('dark');
    expect(screen.getByTestId('palette').textContent).toBe('sunset');
  });

  test('updates theme mode and saves to localStorage', async () => {
    const user = userEvent.setup();

    render(
      <AppThemeProvider>
        <TestConsumer />
      </AppThemeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Set Dark' }));

    expect(screen.getByTestId('mode').textContent).toBe('dark');
    const stored = JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) || '{}');
    expect(stored.themeMode).toBe('dark');
    expect(stored.themePalette).toBe('ocean');
  });

  test('updates theme palette and saves to localStorage', async () => {
    const user = userEvent.setup();

    render(
      <AppThemeProvider>
        <TestConsumer />
      </AppThemeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Set Sunset' }));

    expect(screen.getByTestId('palette').textContent).toBe('sunset');
    const stored = JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) || '{}');
    expect(stored.themeMode).toBe('light');
    expect(stored.themePalette).toBe('sunset');
  });

  test('useAppTheme returns default context value outside provider and dummy functions do not throw', async () => {
    const user = userEvent.setup();

    function OutsideConsumer() {
      const { setThemeMode, setThemePalette, themeMode, themePalette } = useAppTheme();
      return (
        <div>
          <span data-testid="mode">{themeMode}</span>
          <span data-testid="palette">{themePalette}</span>
          <button onClick={() => setThemeMode('dark')} type="button">
            Call Mode
          </button>
          <button onClick={() => setThemePalette('sunset')} type="button">
            Call Palette
          </button>
        </div>
      );
    }

    render(<OutsideConsumer />);

    expect(screen.getByTestId('mode').textContent).toBe('light');
    expect(screen.getByTestId('palette').textContent).toBe('ocean');

    await user.click(screen.getByRole('button', { name: 'Call Mode' }));
    await user.click(screen.getByRole('button', { name: 'Call Palette' }));
  });
});
