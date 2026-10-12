import React from 'react';
import renderer, { act } from 'react-test-renderer';
import MuiThemeProviderPkg from 'material-ui/styles/MuiThemeProvider';
import getMuiThemePkg from 'material-ui/styles/getMuiTheme';
import lightBaseThemePkg from 'material-ui/styles/baseThemes/lightBaseTheme';
import Finished from '../../../../src/learn/math/drill/finished.jsx';
import constants from '../../../../src/learn/common/constants.js';
import db from '../../../../src/learn/db/index.js';

const MuiThemeProvider = MuiThemeProviderPkg.default || MuiThemeProviderPkg;
const getMuiTheme = getMuiThemePkg.default || getMuiThemePkg;
const lightBaseTheme = lightBaseThemePkg.default || lightBaseThemePkg;

const {
  RECORD_NEW,
  RECORD_MISS,
} = constants;
const muiTheme = getMuiTheme(lightBaseTheme);

describe('Finished', () => {
  beforeEach(() => {
    db.getScores = vi.fn();
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

    let component;
    act(() => {
      component = renderer.create(
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
    });

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

    let component;
    act(() => {
      component = renderer.create(
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
    });

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

    let component;
    act(() => {
      component = renderer.create(
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
    });

    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });

  test('should use latest scoreBarTimes timePerQuestion for FinishedBadge when correct answers > 9', () => {
    // 10 correct answers where individual times sum to 31.0s (3.1s average = Bronze)
    const previousResults = Array.from({ length: 10 }, (_, id) => ({
      actuals: [10],
      id,
      task: [5, 5, 0, 10],
      timeTaken: 3.1,
    }));
    const resultInfo = {
      text: 'Result Info Text',
      newRecordInfo: RECORD_NEW,
    };
    // But scoreBarTimes latest is 2.9 (Silver)
    const scoreBarTimes = [{
      date: Date.now(),
      timePerQuestion: 2.9,
    }];

    let component;
    act(() => {
      component = renderer.create(
        <MuiThemeProvider muiTheme={muiTheme}>
          <Finished
            levelIndex={0}
            opIndexes={[0]}
            previousResults={previousResults}
            resultInfo={resultInfo}
            scoreBarTimes={scoreBarTimes}
            timeAllowed={600}
            timeLeft={100}
            totalProblems={10}
          />
        </MuiThemeProvider>,
      );
    });

    const tree = component.toJSON();
    const stringified = JSON.stringify(tree);
    expect(stringified).toContain('Silver Badge');
    expect(stringified).not.toContain('Bronze Badge');
  });

  test('should fallback to calculatedTimePerQuestion when scoreBarTimes is empty and correct answers > 9', () => {
    const previousResults = Array.from({ length: 10 }, (_, id) => ({
      actuals: [10],
      id,
      task: [5, 5, 0, 10],
      timeTaken: 1.5,
    }));
    const resultInfo = {
      text: 'Result Info Text',
      newRecordInfo: RECORD_MISS,
    };

    let component;
    act(() => {
      component = renderer.create(
        <MuiThemeProvider muiTheme={muiTheme}>
          <Finished
            levelIndex={0}
            opIndexes={[0]}
            previousResults={previousResults}
            resultInfo={resultInfo}
            scoreBarTimes={[]}
            timeAllowed={600}
            timeLeft={100}
            totalProblems={10}
          />
        </MuiThemeProvider>,
      );
    });

    const tree = component.toJSON();
    const stringified = JSON.stringify(tree);
    expect(stringified).toContain('Gold Badge');
  });

  test('should render unknown newRecordInfo fallback', () => {
    const previousResults = [{
      actuals: [10],
      id: 1,
      task: [5, 5, 0, 10],
      timeTaken: 2.2,
    }];
    const resultInfo = {
      text: 'Unknown text',
      newRecordInfo: 'UNKNOWN_RECORD_INFO',
    };

    let component;
    act(() => {
      component = renderer.create(
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
        </MuiThemeProvider>,
      );
    });

    const tree = component.toJSON();
    const stringified = JSON.stringify(tree);
    expect(stringified).toContain('Unknown newRecordInfo UNKNOWN_RECORD_INFO in switch case');
  });
});
