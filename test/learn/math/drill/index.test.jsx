import React from 'react';
import renderer, { act } from 'react-test-renderer';
import MuiThemeProviderPkg from 'material-ui/styles/MuiThemeProvider';
import getMuiThemePkg from 'material-ui/styles/getMuiTheme';
import lightBaseThemePkg from 'material-ui/styles/baseThemes/lightBaseTheme';
import Drill from '../../../../src/learn/math/drill/index.jsx';

const MuiThemeProvider = MuiThemeProviderPkg.default || MuiThemeProviderPkg;
const getMuiTheme = getMuiThemePkg.default || getMuiThemePkg;
const lightBaseTheme = lightBaseThemePkg.default || lightBaseThemePkg;

const muiTheme = getMuiTheme(lightBaseTheme);

jest.mock('material-ui/internal/EnhancedSwitch');

describe('Drill', () => {
  test('should render the Drill component', () => {
    const savedOptions = {
      largeKeyboard: true,
      levelIndex: 0, // A
      minutes: '1',
      onscreenKeyboard: true,
      opIndexes: [0], // A
      totalProblems: '20',
      userName: 'my name',
    };

    // eslint-disable-next-line no-proto
    jest.spyOn(window.localStorage.__proto__, 'getItem')
      .mockReturnValue(JSON.stringify(savedOptions));

    let component;
    act(() => {
      component = renderer.create(
        <MuiThemeProvider muiTheme={muiTheme}>
          <Drill />
        </MuiThemeProvider>);
    });

    const app = component.toJSON();
    expect(app).toMatchSnapshot();
  });
});
