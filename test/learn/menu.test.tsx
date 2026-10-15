import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import Menu from '../../src/learn/menu.js';

const theme = createTheme();

describe('Menu', () => {
  const renderMenuAt = (path: string) => {
    return render(
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={[path]}>
          <Menu />
        </MemoryRouter>
      </ThemeProvider>,
    );
  };

  test('should render all Menu buttons', () => {
    renderMenuAt('/');

    expect(screen.getByRole('button', { name: /Home/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Drill/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Score/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Help/i })).toBeDefined();
  });

  test('should mark Home as active with aria-current="page" on route "/"', () => {
    renderMenuAt('/');

    const home = screen.getByRole('button', { name: /Home/i });
    const drill = screen.getByRole('button', { name: /Drill/i });
    const score = screen.getByRole('button', { name: /Score/i });
    const help = screen.getByRole('button', { name: /Help/i });

    expect(home.getAttribute('aria-current')).toBe('page');
    expect(drill.getAttribute('aria-current')).toBeNull();
    expect(score.getAttribute('aria-current')).toBeNull();
    expect(help.getAttribute('aria-current')).toBeNull();
  });

  test('should mark Drill as active with aria-current="page" on route "/math/drill"', () => {
    renderMenuAt('/math/drill');

    const home = screen.getByRole('button', { name: /Home/i });
    const drill = screen.getByRole('button', { name: /Drill/i });

    expect(drill.getAttribute('aria-current')).toBe('page');
    expect(home.getAttribute('aria-current')).toBeNull();
  });

  test('should mark Drill as active with aria-current="page" on nested drill route "/math/drill/running"', () => {
    renderMenuAt('/math/drill/running');

    const drill = screen.getByRole('button', { name: /Drill/i });
    expect(drill.getAttribute('aria-current')).toBe('page');
  });

  test('should mark Score as active with aria-current="page" on route "/math/score"', () => {
    renderMenuAt('/math/score');

    const score = screen.getByRole('button', { name: /Score/i });
    const home = screen.getByRole('button', { name: /Home/i });

    expect(score.getAttribute('aria-current')).toBe('page');
    expect(home.getAttribute('aria-current')).toBeNull();
  });

  test('should mark Help as active with aria-current="page" on route "/help"', () => {
    renderMenuAt('/help');

    const help = screen.getByRole('button', { name: /Help/i });
    const home = screen.getByRole('button', { name: /Home/i });

    expect(help.getAttribute('aria-current')).toBe('page');
    expect(home.getAttribute('aria-current')).toBeNull();
  });

  test('should mark none as active with aria-current="page" on unknown route "/not-found"', () => {
    renderMenuAt('/not-found');

    const home = screen.getByRole('button', { name: /Home/i });
    const drill = screen.getByRole('button', { name: /Drill/i });
    const score = screen.getByRole('button', { name: /Score/i });
    const help = screen.getByRole('button', { name: /Help/i });

    expect(home.getAttribute('aria-current')).toBeNull();
    expect(drill.getAttribute('aria-current')).toBeNull();
    expect(score.getAttribute('aria-current')).toBeNull();
    expect(help.getAttribute('aria-current')).toBeNull();
  });

  test('should render Menu in dark mode with dark mode active styles', () => {
    const darkTheme = createTheme({ palette: { mode: 'dark' } });
    render(
      <ThemeProvider theme={darkTheme}>
        <MemoryRouter initialEntries={['/']}>
          <Menu />
        </MemoryRouter>
      </ThemeProvider>,
    );

    const home = screen.getByRole('button', { name: /Home/i });
    expect(home.getAttribute('aria-current')).toBe('page');
  });
});
