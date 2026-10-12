import React from 'react';
import renderer from 'react-test-renderer';
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
  test('should render an App component', () => {
    const component = renderer.create(
      <MuiThemeProvider muiTheme={muiTheme}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </MuiThemeProvider>);

    const app = component.toJSON();
    expect(app).toMatchSnapshot();
  });
});
