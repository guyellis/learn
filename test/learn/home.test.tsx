import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../../src/learn/home.js';

const theme = createTheme();

describe('Home', () => {
  test('should render a Home component without share button when navigator.share is unavailable', () => {
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
    expect(screen.queryByRole('link', { name: /Issue guyellis\/learn on GitHub/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /Report a bug/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /Share/i })).toBeNull();
  });

  test('should trigger share when share button is clicked and log success', async () => {
    const user = userEvent.setup();
    const shareMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: shareMock,
    });
    // eslint-disable-next-line no-console
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </ThemeProvider>,
    );

    const shareIcon = screen.getByTestId('ShareIcon');
    const shareButton = shareIcon.closest('button')!;
    await user.click(shareButton);

    expect(shareMock).toHaveBeenCalledWith({
      text: 'Math Exercises for Kids',
      title: 'Math Drill',
      url: 'https://learn.headvert.com',
    });

    await vi.waitFor(() => {
      expect(logSpy).toHaveBeenCalledWith('Successful share');
    });

    logSpy.mockRestore();
    // @ts-expect-error cleanup navigator.share
    delete navigator.share;
  });

  test('should log error when share rejects', async () => {
    const user = userEvent.setup();
    const error = new Error('Share failed');
    const shareMock = vi.fn().mockRejectedValue(error);
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: shareMock,
    });
    // eslint-disable-next-line no-console
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </ThemeProvider>,
    );

    const shareIcon = screen.getByTestId('ShareIcon');
    const shareButton = shareIcon.closest('button')!;
    await user.click(shareButton);

    await vi.waitFor(() => {
      expect(logSpy).toHaveBeenCalledWith('Error sharing', error);
    });

    logSpy.mockRestore();
    // @ts-expect-error cleanup navigator.share
    delete navigator.share;
  });
});
