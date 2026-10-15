import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/app.js';
import helper from '../src/learn/math/drill/helper.js';

const theme = createTheme();

describe('App', () => {
  const renderApp = async (path: string = '/') => {
    // Preload lazy route module so dynamic import resolves immediately
    if (path === '/') {
      await import('../src/learn/home.js');
    } else if (path === '/math/drill') {
      await import('../src/learn/math/drill/index.js');
    } else if (path === '/math/score') {
      await import('../src/learn/math/drill/scoreboard.js');
    } else if (path === '/help') {
      await import('../src/learn/help/index.js');
    } else {
      await import('../src/learn/not-found.js');
    }

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
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  test('should return to fresh drill setup screen when Drill menu item is clicked from finished state', async () => {
    const user = userEvent.setup();
    const savedOptions = {
      levelIndex: 0,
      minutes: '1',
      opIndexes: [0],
      totalProblems: '1',
      userName: 'Tester',
    };
    const getItemSpy = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValue(JSON.stringify(savedOptions));
    const nextTaskSpy = vi.spyOn(helper, 'getNextTask').mockReturnValue([1, 2, 0, 3]);

    await renderApp('/math/drill');

    expect(await screen.findByRole('heading', { level: 2, name: /Level/i })).toBeDefined();
    const startButton = screen.getByRole('button', { name: /Start/i });

    await user.click(startButton);

    const answerButton = await screen.findByRole('button', { name: '3' });
    await user.click(answerButton);

    expect(screen.queryByRole('button', { name: /Start/i })).toBeNull();

    const drillMenuButton = screen.getByRole('button', { name: /^Drill$/i });
    await user.click(drillMenuButton);

    expect(await screen.findByRole('heading', { level: 2, name: /Level/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Start/i })).toBeDefined();
    expect(screen.getByLabelText(/Your Name/i)).toHaveProperty('value', 'Tester');

    getItemSpy.mockRestore();
    nextTaskSpy.mockRestore();
  });

  test('should return to fresh drill setup screen when Drill menu item is clicked from running state', async () => {
    const user = userEvent.setup();
    const nextTaskSpy = vi.spyOn(helper, 'getNextTask').mockReturnValue([1, 2, 0, 3]);

    await renderApp('/math/drill');

    expect(await screen.findByRole('heading', { level: 2, name: /Level/i })).toBeDefined();
    await user.click(screen.getByRole('button', { name: /Start/i }));

    expect(await screen.findByRole('button', { name: '3' })).toBeDefined();
    expect(screen.queryByRole('button', { name: /Start/i })).toBeNull();

    const drillMenuButton = screen.getByRole('button', { name: /^Drill$/i });
    await user.click(drillMenuButton);

    expect(await screen.findByRole('heading', { level: 2, name: /Level/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Start/i })).toBeDefined();

    nextTaskSpy.mockRestore();
  });

  test('should return to fresh drill setup screen when Drill menu item is clicked from start state', async () => {
    const user = userEvent.setup();

    await renderApp('/math/drill');

    expect(await screen.findByRole('heading', { level: 2, name: /Level/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Start/i })).toBeDefined();

    const drillMenuButton = screen.getByRole('button', { name: /^Drill$/i });
    await user.click(drillMenuButton);

    expect(await screen.findByRole('heading', { level: 2, name: /Level/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Start/i })).toBeDefined();
  });

  test('should not reset drill component on unrelated re-renders', async () => {
    const user = userEvent.setup();
    const nextTaskSpy = vi.spyOn(helper, 'getNextTask').mockReturnValue([1, 2, 0, 3]);

    const { rerender } = render(
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/math/drill']}>
          <App />
        </MemoryRouter>
      </ThemeProvider>,
    );

    expect(await screen.findByRole('heading', { level: 2, name: /Level/i })).toBeDefined();
    await user.click(screen.getByRole('button', { name: /Start/i }));

    expect(await screen.findByRole('button', { name: '3' })).toBeDefined();

    // Re-render without navigation
    rerender(
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/math/drill']}>
          <App />
        </MemoryRouter>
      </ThemeProvider>,
    );

    // Drill should still be in running state
    expect(screen.getByRole('button', { name: '3' })).toBeDefined();

    nextTaskSpy.mockRestore();
  });
});
