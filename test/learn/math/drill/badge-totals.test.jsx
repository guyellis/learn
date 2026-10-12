import React from 'react';
import renderer from 'react-test-renderer';
import MuiThemeProviderPkg from 'material-ui/styles/MuiThemeProvider';
import getMuiThemePkg from 'material-ui/styles/getMuiTheme';
import lightBaseThemePkg from 'material-ui/styles/baseThemes/lightBaseTheme';
import BadgeTotals from '../../../../src/learn/math/drill/badge-totals.jsx';

const MuiThemeProvider = MuiThemeProviderPkg.default || MuiThemeProviderPkg;
const getMuiTheme = getMuiThemePkg.default || getMuiThemePkg;
const lightBaseTheme = lightBaseThemePkg.default || lightBaseThemePkg;

const muiTheme = getMuiTheme(lightBaseTheme);

test('Badge totals should be rendered', () => {
  const component = renderer.create(
    <MuiThemeProvider muiTheme={muiTheme}>
      <BadgeTotals totals={[1, 2, 3]} />
    </MuiThemeProvider>);
  const badgeTotals = component.toJSON();
  expect(badgeTotals).toMatchSnapshot();
});
