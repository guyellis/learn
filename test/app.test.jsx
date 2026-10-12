import React from 'react';
import renderer, { act } from 'react-test-renderer';
import MuiThemeProviderPkg from 'material-ui/styles/MuiThemeProvider';
import getMuiThemePkg from 'material-ui/styles/getMuiTheme';
import lightBaseThemePkg from 'material-ui/styles/baseThemes/lightBaseTheme';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/app.jsx';

const MuiThemeProvider = MuiThemeProviderPkg.default || MuiThemeProviderPkg;
const getMuiTheme = getMuiThemePkg.default || getMuiThemePkg;
const lightBaseTheme = lightBaseThemePkg.default || lightBaseThemePkg;

const muiTheme = getMuiTheme(lightBaseTheme);

describe('App', () => {
  const renderApp = async (path = '/') => {
    let component;
    act(() => {
      component = renderer.create(
        <MuiThemeProvider muiTheme={muiTheme}>
          <MemoryRouter initialEntries={[path]}>
            <App />
          </MemoryRouter>
        </MuiThemeProvider>,
      );
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
    act(() => {});
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

  test('should redirect unknown route to home', async () => {
    const component = await renderApp('/unknown');
    const app = component.toJSON();
    expect(app).toMatchSnapshot();
  });
});
