import React from 'react';
import renderer, { act } from 'react-test-renderer';
import MuiThemeProviderPkg from 'material-ui/styles/MuiThemeProvider';
import getMuiThemePkg from 'material-ui/styles/getMuiTheme';
import lightBaseThemePkg from 'material-ui/styles/baseThemes/lightBaseTheme';
import db from '../../../../src/learn/db/index.js';
import ScoreBoard from '../../../../src/learn/math/drill/scoreboard.jsx';

const MuiThemeProvider = MuiThemeProviderPkg.default || MuiThemeProviderPkg;
const getMuiTheme = getMuiThemePkg.default || getMuiThemePkg;
const lightBaseTheme = lightBaseThemePkg.default || lightBaseThemePkg;

const muiTheme = getMuiTheme(lightBaseTheme);

describe('ScoreBoard', () => {
  beforeEach(() => {
    db.getScores = jest.fn();
  });

  afterEach(() => {
    db.getScores.mockClear();
  });

  test('should render showScoreBoard', () => {
    db.getScores.mockReturnValueOnce([{
      levelIndex: 0,
      correctCount: 10,
      opIndexes: [0],
      timePerQuestion: 6,
    }]);

    let component;
    act(() => {
      component = renderer.create(
        <MuiThemeProvider muiTheme={muiTheme}>
          <ScoreBoard />
        </MuiThemeProvider>,
      );
    });

    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });

  test('should clear record history when clear button is clicked', () => {
    db.getScores.mockReturnValue([{
      levelIndex: 0,
      correctCount: 10,
      opIndexes: [0],
      timePerQuestion: 6,
    }]);
    db.clearScores = jest.fn();

    let component;
    act(() => {
      component = renderer.create(
        <MuiThemeProvider muiTheme={muiTheme}>
          <ScoreBoard />
        </MuiThemeProvider>,
      );
    });

    const button = component.root.findByProps({ id: 'clear-record-history' });
    act(() => {
      button.props.onClick();
    });

    expect(db.clearScores).toHaveBeenCalled();
  });
});
