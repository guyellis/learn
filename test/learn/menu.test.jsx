import React from 'react';
import renderer, { act } from 'react-test-renderer';
import MuiThemeProviderPkg from 'material-ui/styles/MuiThemeProvider';
import getMuiThemePkg from 'material-ui/styles/getMuiTheme';
import lightBaseThemePkg from 'material-ui/styles/baseThemes/lightBaseTheme';
import { MemoryRouter } from 'react-router-dom';
import Menu from '../../src/learn/menu.jsx';

const MuiThemeProvider = MuiThemeProviderPkg.default || MuiThemeProviderPkg;
const getMuiTheme = getMuiThemePkg.default || getMuiThemePkg;
const lightBaseTheme = lightBaseThemePkg.default || lightBaseThemePkg;

const muiTheme = getMuiTheme(lightBaseTheme);

describe('Menu', () => {
  test('should render a Menu component', () => {
    let component;
    act(() => {
      component = renderer.create(
        <MuiThemeProvider muiTheme={muiTheme}>
          <MemoryRouter>
            <Menu />
          </MemoryRouter>
        </MuiThemeProvider>);
    });

    const app = component.toJSON();
    expect(app).toMatchSnapshot();
  });
});
