import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import Badge from '../../../../src/learn/math/drill/badge.jsx';

const theme = createTheme();

test('Badge should be rendered', () => {
  let component;
  act(() => {
    component = renderer.create(
      <ThemeProvider theme={theme}>
        <Badge color={0} content="+" />
      </ThemeProvider>,
    );
  });
  const badgeTotals = component.toJSON();
  expect(badgeTotals).toMatchSnapshot();
});
