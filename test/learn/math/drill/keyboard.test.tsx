import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Keyboard from '../../../../src/learn/math/drill/keyboard.js';

const theme = createTheme();

describe('Keyboard', () => {
  test('should render keyboard buttons and handle clicks', async () => {
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

  test('should not render anything when onscreenKeyboard is false', () => {
    const keyPress = vi.fn();
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Keyboard keyPress={keyPress} largeKeyboard={false} onscreenKeyboard={false} />
      </ThemeProvider>,
    );

    expect(container.firstChild).toBeNull();
  });

  test('should render normal buttons and handle nothing click without calling keyPress', () => {
    const keyPress = vi.fn();
    const keyboardRef = React.createRef<Keyboard>();
    render(
      <ThemeProvider theme={theme}>
        <Keyboard keyPress={keyPress} largeKeyboard={false} onscreenKeyboard ref={keyboardRef} />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button', { name: 'One' })).toBeDefined();

    keyboardRef.current?.onClick('nothing');
    expect(keyPress).not.toHaveBeenCalled();

    keyboardRef.current?.onClick(2);
    expect(keyPress).toHaveBeenCalledWith(2);
  });
});
