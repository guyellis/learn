
const React = require('react');
const Keyboard = require('../../../../src/learn/math/drill/keyboard');
const renderer = require('react-test-renderer');
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;
const getMuiTheme = require('material-ui/styles/getMuiTheme').default;
const lightBaseTheme = require('material-ui/styles/baseThemes/lightBaseTheme').default;

const muiTheme = getMuiTheme(lightBaseTheme);

test('Badge totals should be rendered', () => {
  const component = renderer.create(
    <MuiThemeProvider muiTheme={muiTheme}>
      <Keyboard
        keyPress={jest.fn()}
        onscreenKeyboard
        largeKeyboard
      />
    </MuiThemeProvider>);
  const badgeTotals = component.toJSON();
  expect(badgeTotals).toMatchSnapshot();
});
