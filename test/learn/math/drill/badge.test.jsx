import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Badge from '../../../../src/learn/math/drill/badge.jsx';

const theme = createTheme();

test('Badge should be rendered', () => {
  render(
    <ThemeProvider theme={theme}>
      <Badge color={0} content="+" />
    </ThemeProvider>,
  );
  const button = screen.getByRole('button', { name: '+' });
  expect(button).toBeDefined();
  expect(button.textContent).toBe('+');
});
