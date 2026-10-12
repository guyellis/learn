import React from 'react';
import renderer, { act } from 'react-test-renderer';
import MuiThemeProviderPkg from 'material-ui/styles/MuiThemeProvider';
import getMuiThemePkg from 'material-ui/styles/getMuiTheme';
import lightBaseThemePkg from 'material-ui/styles/baseThemes/lightBaseTheme';
import FinishedBadge from '../../../../src/learn/math/drill/finished-badge.jsx';

const MuiThemeProvider = MuiThemeProviderPkg.default || MuiThemeProviderPkg;
const getMuiTheme = getMuiThemePkg.default || getMuiThemePkg;
const lightBaseTheme = lightBaseThemePkg.default || lightBaseThemePkg;

const muiTheme = getMuiTheme(lightBaseTheme);

describe('Finished Badge', () => {
  test('should be rendered on happy path', () => {
    let component;
    act(() => {
      component = renderer.create(
        <MuiThemeProvider muiTheme={muiTheme}>
          <FinishedBadge
            levelIndex={0}
            opIndexes={[0]}
            timePerQuestion={2.2}
            totalCorrectAnswers={10}
          />
        </MuiThemeProvider>);
    });
    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });

  test('should be rendered if multiple opIndexes', () => {
    let component;
    act(() => {
      component = renderer.create(
        <MuiThemeProvider muiTheme={muiTheme}>
          <FinishedBadge
            levelIndex={0}
            opIndexes={[0, 1]}
            timePerQuestion={2.2}
            totalCorrectAnswers={10}
          />
        </MuiThemeProvider>);
    });
    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });

  test('should not be rendered if correct answers under 10', () => {
    let component;
    act(() => {
      component = renderer.create(
        <MuiThemeProvider muiTheme={muiTheme}>
          <FinishedBadge
            levelIndex={0}
            opIndexes={[0]}
            timePerQuestion={2.2}
            totalCorrectAnswers={9}
          />
        </MuiThemeProvider>);
    });
    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });
});
