import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/app.jsx';

const theme = createTheme();

describe('App', () => {
  const renderApp = async (path = '/') => {
    // Preload lazy route module so dynamic import resolves immediately
    if (path === '/') await import('../src/learn/home.jsx');
    else if (path === '/math/drill') await import('../src/learn/math/drill/index.jsx');
    else if (path === '/math/score') await import('../src/learn/math/drill/scoreboard.jsx');
    else if (path === '/help') await import('../src/learn/help/index.jsx');
    else await import('../src/learn/not-found.jsx');

    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>
      </ThemeProvider>,
    );
  };

  test('should render an App component', async () => {
    await renderApp('/');
    expect(await screen.findByRole('button', { name: /Math Drill/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Scoreboard/i })).toBeDefined();
  });

  test('should render the Drill route', async () => {
    await renderApp('/math/drill');
    expect(await screen.findByRole('heading', { level: 2, name: /Level/i })).toBeDefined();
  });

  test('should render the Score route', async () => {
    await renderApp('/math/score');
    expect(await screen.findByRole('button', { name: /Clear Record History/i })).toBeDefined();
  });

  test('should render the Help route', async () => {
    await renderApp('/help');
    expect(
      await screen.findByRole('heading', { level: 3, name: /Help with Math Drill/i }),
    ).toBeDefined();
  });

  test('should render the NotFound component for unknown route', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await renderApp('/unknown');
    expect(await screen.findByAltText('404 Page Not Found')).toBeDefined();
    expect(screen.getByRole('heading', { level: 1, name: /Oops! Page Not Found/i })).toBeDefined();
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
