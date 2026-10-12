import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import BadgeTotals from '../../../../src/learn/math/drill/badge-totals.jsx';

const theme = createTheme();

test('Badge totals should be rendered', () => {
  let component;
  act(() => {
    component = renderer.create(
      <ThemeProvider theme={theme}>
        <BadgeTotals totals={[1, 2, 3]} />
      </ThemeProvider>,
    );
  });
  const badgeTotals = component.toJSON();
  expect(badgeTotals).toMatchSnapshot();
});
