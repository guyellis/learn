import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
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

    let component;
    await act(async () => {
      component = renderer.create(
        <ThemeProvider theme={theme}>
          <MemoryRouter initialEntries={[path]}>
            <App />
          </MemoryRouter>
        </ThemeProvider>,
      );
    });

    const startTime = Date.now();
    const timeout = 5000;
    while (Date.now() - startTime < timeout) {
      const tree = JSON.stringify(component.toJSON());
      if (tree && !tree.includes('Loading...')) {
        break;
      }
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
      });
    }
    return component;
  };

  test('should render an App component', async () => {
    const component = await renderApp('/');
    const app = component.toJSON();
    expect(app).toMatchSnapshot();
  });

  test('should render the Drill route', async () => {
    const component = await renderApp('/math/drill');
    expect(component.root.findAllByType('h2')[0].children).toEqual(['Level']);
  });

  test('should render the Score route', async () => {
    const component = await renderApp('/math/score');
    expect(component.root.findByProps({ id: 'clear-record-history' })).toBeDefined();
  });

  test('should render the Help route', async () => {
    const component = await renderApp('/help');
    expect(component.toJSON()).toBeDefined();
  });

  test('should render the NotFound component for unknown route', async () => {
    const component = await renderApp('/unknown');
    expect(component.root.findByProps({ alt: '404 Page Not Found' })).toBeDefined();
    const app = component.toJSON();
    expect(app).toMatchSnapshot();
  });
});
