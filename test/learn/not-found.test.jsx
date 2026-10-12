import React from 'react';
import renderer, { act } from 'react-test-renderer';
import MuiThemeProviderPkg from 'material-ui/styles/MuiThemeProvider';
import getMuiThemePkg from 'material-ui/styles/getMuiTheme';
import lightBaseThemePkg from 'material-ui/styles/baseThemes/lightBaseTheme';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../../src/learn/not-found.jsx';

const MuiThemeProvider = MuiThemeProviderPkg.default || MuiThemeProviderPkg;
const getMuiTheme = getMuiThemePkg.default || getMuiThemePkg;
const lightBaseTheme = lightBaseThemePkg.default || lightBaseThemePkg;

const muiTheme = getMuiTheme(lightBaseTheme);

describe('NotFound', () => {
  test('should render a NotFound component', () => {
    let component;
    act(() => {
      component = renderer.create(
        <MuiThemeProvider muiTheme={muiTheme}>
          <MemoryRouter>
            <NotFound />
          </MemoryRouter>
        </MuiThemeProvider>,
      );
    });

    const app = component.toJSON();
    expect(app).toMatchSnapshot();

    const img = component.root.findByProps({ alt: '404 Page Not Found' });
    expect(img.props.src).toEqual('/404.webp');

    const link = component.root.findByProps({ to: '/' });
    expect(link).toBeDefined();
  });
});
