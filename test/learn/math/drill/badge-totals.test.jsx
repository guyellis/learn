
const React = require('react');
const BadgeTotals = require('../../../../src/learn/math/drill/badge-totals');
const renderer = require('react-test-renderer');
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;
const getMuiTheme = require('material-ui/styles/getMuiTheme').default;
const lightBaseTheme = require('material-ui/styles/baseThemes/lightBaseTheme').default;

const muiTheme = getMuiTheme(lightBaseTheme);

test('Badge totals should be rendered', () => {
  const component = renderer.create(
    <MuiThemeProvider muiTheme={muiTheme}>
      <BadgeTotals totals={[1, 2, 3]} />
    </MuiThemeProvider>
  );
  const badgeTotals = component.toJSON();
  expect(badgeTotals).toMatchSnapshot();
});
