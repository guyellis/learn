const React = require('react');
const renderer = require('react-test-renderer');
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;
const getMuiTheme = require('material-ui/styles/getMuiTheme').default;
const lightBaseTheme = require('material-ui/styles/baseThemes/lightBaseTheme').default;
const Finished = require('../../../../src/learn/math/drill/finished');
const constants = require('../../../../src/learn/common/constants');
const db = require('../../../../src/learn/db');

const {
  RECORD_NEW,
  // RECORD_EQUAL,
  // RECORD_MISS,
  // RECORD_NOT_EXIST,
} = constants;
const muiTheme = getMuiTheme(lightBaseTheme);

describe('Finished', () => {
  beforeEach(() => {
    db.getScores = jest.fn();
  });

  afterEach(() => {
    db.getScores.mockClear();
  });

  test('should render when there is a single incorrect result', () => {
    const previousResults = [{
      actuals: [5],
      id: 1,
      task: [5, 5, 0, 10],
      timeTaken: 2.2,
    }];
    const resultInfo = {
      text: 'Result Info Text',
      newRecordInfo: RECORD_NEW,
    };

    const component = renderer.create(
      <MuiThemeProvider muiTheme={muiTheme}>
        <Finished
          levelIndex={0}
          opIndexes={[0]}
          previousResults={previousResults}
          resultInfo={resultInfo}
          timeAllowed={600}
          timeLeft={100}
          totalProblems={20}
        />
      </MuiThemeProvider>);

    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });

  test('should render when there is a single correct result', () => {
    const previousResults = [{
      actuals: [10],
      id: 1,
      task: [5, 5, 0, 10],
      timeTaken: 2.2,
    }];
    const resultInfo = {
      text: 'Result Info Text',
      newRecordInfo: RECORD_NEW,
    };

    const component = renderer.create(
      <MuiThemeProvider muiTheme={muiTheme}>
        <Finished
          levelIndex={0}
          opIndexes={[0]}
          previousResults={previousResults}
          resultInfo={resultInfo}
          timeAllowed={600}
          timeLeft={100}
          totalProblems={20}
        />
      </MuiThemeProvider>);

    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });

  test('should render when there is a mix of correct and incorrect results', () => {
    const previousResults = [{
      actuals: [5], // single incorrect
      id: 1,
      task: [5, 5, 0, 10],
      timeTaken: 2.2,
    }, {
      actuals: [10], // single correct
      id: 2,
      task: [5, 5, 0, 10],
      timeTaken: 2.2,
    }, {
      actuals: [10, 5, 4, 3], // correct with some wrong
      id: 3,
      task: [5, 5, 0, 10],
      timeTaken: 2.2,
    }];
    const resultInfo = {
      text: 'Result Info Text',
      newRecordInfo: RECORD_NEW,
    };
    db.getScores.mockReturnValueOnce([{
      key: '0-01',
      timePerQuestion: 2,
    }, {
      key: '0-02',
      timePerQuestion: 0.5,
    }, {
      key: '0-01',
      timePerQuestion: 1,
    }]);

    const component = renderer.create(
      <MuiThemeProvider muiTheme={muiTheme}>
        <Finished
          levelIndex={0}
          opIndexes={[0]}
          previousResults={previousResults}
          resultInfo={resultInfo}
          timeAllowed={600}
          timeLeft={100}
          totalProblems={20}
        />
      </MuiThemeProvider>);

    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });
});
