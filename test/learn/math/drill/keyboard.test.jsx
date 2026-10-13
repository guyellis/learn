import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import Keyboard from '../../../../src/learn/math/drill/keyboard.jsx';

const theme = createTheme();

test('Badge totals should be rendered', () => {
  let component;
  act(() => {
    component = renderer.create(
      <ThemeProvider theme={theme}>
        <Keyboard keyPress={vi.fn()} largeKeyboard onscreenKeyboard />
      </ThemeProvider>,
    );
  });
  const badgeTotals = component.toJSON();
  expect(badgeTotals).toMatchSnapshot();
});
