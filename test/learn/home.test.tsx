import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import Home from '../../src/learn/home.js';
import { AppThemeProvider } from '../../src/theme/app-theme-provider.js';
import { THEME_STORAGE_KEY } from '../../src/theme/theme-storage.js';

describe('Home', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  test('should render a Home component without share button when navigator.share is unavailable', () => {
    render(
      <AppThemeProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </AppThemeProvider>,
    );

    expect(screen.getByRole('button', { name: /Math Drill/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Scoreboard/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Help/i })).toBeDefined();
    expect(screen.queryByRole('link', { name: /Issue guyellis\/learn on GitHub/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /Report a bug/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /Share/i })).toBeNull();
  });

  test('should trigger share when share button is clicked and log success', async () => {
    const user = userEvent.setup();
    const shareMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: shareMock,
    });
    // eslint-disable-next-line no-console
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    render(
      <AppThemeProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </AppThemeProvider>,
    );

    const shareIcon = screen.getByTestId('ShareIcon');
    const shareButton = shareIcon.closest('button')!;
    await user.click(shareButton);

    expect(shareMock).toHaveBeenCalledWith({
      text: 'Math Exercises for Kids',
      title: 'Math Drill',
      url: 'https://learn.headvert.com',
    });

    await vi.waitFor(() => {
      expect(logSpy).toHaveBeenCalledWith('Successful share');
    });

    logSpy.mockRestore();
    // @ts-expect-error cleanup navigator.share
    delete navigator.share;
  });

  test('should log error when share rejects', async () => {
    const user = userEvent.setup();
    const error = new Error('Share failed');
    const shareMock = vi.fn().mockRejectedValue(error);
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: shareMock,
    });
    // eslint-disable-next-line no-console
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    render(
      <AppThemeProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </AppThemeProvider>,
    );

    const shareIcon = screen.getByTestId('ShareIcon');
    const shareButton = shareIcon.closest('button')!;
    await user.click(shareButton);

    await vi.waitFor(() => {
      expect(logSpy).toHaveBeenCalledWith('Error sharing', error);
    });

    logSpy.mockRestore();
    // @ts-expect-error cleanup navigator.share
    delete navigator.share;
  });

  describe('Theme picker', () => {
    test('renders Theme section with all 4 palettes and mode choices', () => {
      render(
        <AppThemeProvider>
          <MemoryRouter>
            <Home />
          </MemoryRouter>
        </AppThemeProvider>,
      );

      expect(screen.getByRole('heading', { level: 2, name: /Theme/i })).toBeDefined();

      const defaultBtn = screen.getByRole('button', { name: /Default palette/i });
      const oceanBtn = screen.getByRole('button', { name: /Ocean palette/i });
      const sunsetBtn = screen.getByRole('button', { name: /Sunset palette/i });
      const forestBtn = screen.getByRole('button', { name: /Forest palette/i });

      expect(defaultBtn).toBeDefined();
      expect(oceanBtn).toBeDefined();
      expect(sunsetBtn).toBeDefined();
      expect(forestBtn).toBeDefined();

      // Ocean is the default palette
      expect(oceanBtn.getAttribute('aria-pressed')).toBe('true');
      expect(defaultBtn.getAttribute('aria-pressed')).toBe('false');
      expect(sunsetBtn.getAttribute('aria-pressed')).toBe('false');
      expect(forestBtn.getAttribute('aria-pressed')).toBe('false');

      // Light mode is the default mode
      const lightBtn = screen.getByRole('button', { name: /Light mode/i });
      const darkBtn = screen.getByRole('button', { name: /Dark mode/i });
      expect(lightBtn.getAttribute('aria-pressed')).toBe('true');
      expect(darkBtn.getAttribute('aria-pressed')).toBe('false');
    });

    test('selecting a palette updates active styling and saves to localStorage', async () => {
      const user = userEvent.setup();

      render(
        <AppThemeProvider>
          <MemoryRouter>
            <Home />
          </MemoryRouter>
        </AppThemeProvider>,
      );

      const sunsetBtn = screen.getByRole('button', { name: /Sunset palette/i });
      const oceanBtn = screen.getByRole('button', { name: /Ocean palette/i });

      await user.click(sunsetBtn);

      expect(sunsetBtn.getAttribute('aria-pressed')).toBe('true');
      expect(oceanBtn.getAttribute('aria-pressed')).toBe('false');

      const stored = JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) || '{}');
      expect(stored.themePalette).toBe('sunset');
      expect(stored.themeMode).toBe('light');
    });

    test('selecting a mode updates active styling and saves to localStorage', async () => {
      const user = userEvent.setup();

      render(
        <AppThemeProvider>
          <MemoryRouter>
            <Home />
          </MemoryRouter>
        </AppThemeProvider>,
      );

      const darkBtn = screen.getByRole('button', { name: /Dark mode/i });
      const lightBtn = screen.getByRole('button', { name: /Light mode/i });

      // Clicking already active light mode passes null to onChange (does nothing)
      await user.click(lightBtn);
      expect(lightBtn.getAttribute('aria-pressed')).toBe('true');

      await user.click(darkBtn);

      expect(darkBtn.getAttribute('aria-pressed')).toBe('true');
      expect(lightBtn.getAttribute('aria-pressed')).toBe('false');

      const stored = JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) || '{}');
      expect(stored.themeMode).toBe('dark');
      expect(stored.themePalette).toBe('ocean');
    });
  });
});
