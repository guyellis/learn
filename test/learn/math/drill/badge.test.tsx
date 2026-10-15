import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Badge from '../../../../src/learn/math/drill/badge.js';

const theme = createTheme();

test('Badge should be rendered as a non-interactive element', () => {
  render(
    <ThemeProvider theme={theme}>
      <Badge content="+" />
    </ThemeProvider>,
  );
  const badgeElement = screen.getByText('+');
  expect(badgeElement).toBeDefined();
  expect(screen.queryByRole('button')).toBeNull();
});
