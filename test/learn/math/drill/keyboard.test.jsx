import { createTheme, ThemeProvider } from '@mui/material/styles';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import Keyboard from '../../../../src/learn/math/drill/keyboard.jsx';

const theme = createTheme();

test('Badge totals should be rendered', () => {
  const keyPress = vi.fn();
  render(
    <ThemeProvider theme={theme}>
      <Keyboard keyPress={keyPress} largeKeyboard onscreenKeyboard />
    </ThemeProvider>,
  );

  const button1 = screen.getByRole('button', { name: 'One' });
  expect(button1).toBeDefined();
  expect(screen.getByRole('button', { name: 'Zero' })).toBeDefined();
  expect(screen.getByRole('button', { name: 'Nine' })).toBeDefined();

  fireEvent.click(button1);
  expect(keyPress).toHaveBeenCalledWith(1);
});
