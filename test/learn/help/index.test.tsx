import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Help from '../../../src/learn/help/index.js';

const theme = createTheme();

describe('Help', () => {
  test('should render the Help component', () => {
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <Help />
        </MemoryRouter>
      </ThemeProvider>,
    );

    expect(screen.getByRole('heading', { level: 3, name: /Help with Math Drill/i })).toBeDefined();
    expect(screen.getByRole('heading', { level: 4, name: /Options/i })).toBeDefined();
    expect(screen.getByRole('heading', { level: 3, name: /Running/i })).toBeDefined();
    expect(screen.getByRole('heading', { level: 1, name: /Scoreboard/i })).toBeDefined();
  });
});
