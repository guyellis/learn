import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Keyboard from '../../../../src/learn/math/drill/keyboard.jsx';

const theme = createTheme();

test('Badge totals should be rendered', async () => {
  const user = userEvent.setup();
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

  await user.click(button1);
  expect(keyPress).toHaveBeenCalledWith(1);
});
