import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../../src/learn/home.jsx';

const theme = createTheme();

describe('Home', () => {
  test('should render a Home component', () => {
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </ThemeProvider>,
    );

    expect(screen.getByRole('button', { name: /Math Drill/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Scoreboard/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Help/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /Issue guyellis\/learn on GitHub/i })).toBeDefined();
  });
});
