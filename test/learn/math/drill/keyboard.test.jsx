import React from 'react';
import renderer, { act } from 'react-test-renderer';
import MuiThemeProviderPkg from 'material-ui/styles/MuiThemeProvider';
import getMuiThemePkg from 'material-ui/styles/getMuiTheme';
import lightBaseThemePkg from 'material-ui/styles/baseThemes/lightBaseTheme';
import Keyboard from '../../../../src/learn/math/drill/keyboard.jsx';

const MuiThemeProvider = MuiThemeProviderPkg.default || MuiThemeProviderPkg;
const getMuiTheme = getMuiThemePkg.default || getMuiThemePkg;
const lightBaseTheme = lightBaseThemePkg.default || lightBaseThemePkg;

const muiTheme = getMuiTheme(lightBaseTheme);

test('Badge totals should be rendered', () => {
  let component;
  act(() => {
    component = renderer.create(
      <MuiThemeProvider muiTheme={muiTheme}>
        <Keyboard
          keyPress={jest.fn()}
          onscreenKeyboard
          largeKeyboard
        />
      </MuiThemeProvider>);
  });
  const badgeTotals = component.toJSON();
  expect(badgeTotals).toMatchSnapshot();
});
