const React = require('react');
const ScoreBoard = require('../../../../src/learn/math/drill/scoreboard');
const renderer = require('react-test-renderer');
const db = require('../../../../src/learn/db');
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;
const getMuiTheme = require('material-ui/styles/getMuiTheme').default;
const lightBaseTheme = require('material-ui/styles/baseThemes/lightBaseTheme').default;

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

    const component = renderer.create(
      <MuiThemeProvider muiTheme={muiTheme}>
        <ScoreBoard />
      </MuiThemeProvider>,
    );

    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });
});
