import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import React from 'react';
import BadgeTotals from '../../../../src/learn/math/drill/badge-totals.jsx';

const theme = createTheme();

test('Badge totals should be rendered', () => {
  render(
    <ThemeProvider theme={theme}>
      <BadgeTotals totals={[1, 2, 3]} />
    </ThemeProvider>,
  );

  expect(screen.getByRole('button', { name: '1' })).toBeDefined();
  expect(screen.getByRole('button', { name: '2' })).toBeDefined();
  expect(screen.getByRole('button', { name: '3' })).toBeDefined();
  expect(screen.getByText(/Gold Badge\(s\) - 2 seconds or less \(per question\)/i)).toBeDefined();
  expect(
    screen.getByText(/Silver Badge\(s\) - between 2 and 3 seconds \(per question\)/i),
  ).toBeDefined();
  expect(
    screen.getByText(/Bronze Badge\(s\) - between 3 and 4 seconds \(per question\)/i),
  ).toBeDefined();
});
