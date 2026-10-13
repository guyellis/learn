import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Menu from '../../src/learn/menu.js';

const theme = createTheme();

describe('Menu', () => {
  test('should render a Menu component', () => {
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <Menu />
        </MemoryRouter>
      </ThemeProvider>,
    );

    expect(screen.getByRole('button', { name: /Home/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Drill/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Score/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Help/i })).toBeDefined();
  });
});
