import React from 'react';
import renderer, { act } from 'react-test-renderer';
import MuiThemeProviderPkg from 'material-ui/styles/MuiThemeProvider';
import getMuiThemePkg from 'material-ui/styles/getMuiTheme';
import lightBaseThemePkg from 'material-ui/styles/baseThemes/lightBaseTheme';
import Badge from '../../../../src/learn/math/drill/badge.jsx';

const MuiThemeProvider = MuiThemeProviderPkg.default || MuiThemeProviderPkg;
const getMuiTheme = getMuiThemePkg.default || getMuiThemePkg;
const lightBaseTheme = lightBaseThemePkg.default || lightBaseThemePkg;

const muiTheme = getMuiTheme(lightBaseTheme);

test('Badge should be rendered', () => {
  let component;
  act(() => {
    component = renderer.create(
      <MuiThemeProvider muiTheme={muiTheme}>
        <Badge
          color={0}
          content="+"
        />
      </MuiThemeProvider>);
  });
  const badgeTotals = component.toJSON();
  expect(badgeTotals).toMatchSnapshot();
});
