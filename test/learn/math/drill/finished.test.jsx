import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import constants from '../../../../src/learn/common/constants.js';
import db from '../../../../src/learn/db/index.js';
import Finished from '../../../../src/learn/math/drill/finished.jsx';

const theme = createTheme();

const { RECORD_MISS, RECORD_NEW } = constants;

describe('Finished', () => {
  beforeEach(() => {
    db.getScores = vi.fn();
  });

  afterEach(() => {
    db.getScores.mockClear();
  });

  test('should render when there is a single incorrect result', () => {
    const previousResults = [
      {
        actuals: [5],
        id: 1,
        task: [5, 5, 0, 10],
        timeTaken: 2.2,
      },
    ];
    const resultInfo = {
      newRecordInfo: RECORD_NEW,
      text: 'Result Info Text',
    };

    let component;
    act(() => {
      component = renderer.create(
        <ThemeProvider theme={theme}>
          <Finished
            levelIndex={0}
            opIndexes={[0]}
            previousResults={previousResults}
            resultInfo={resultInfo}
            timeAllowed={600}
            timeLeft={100}
            totalProblems={20}
          />
        </ThemeProvider>,
      );
    });

    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });

  test('should render when there is a single correct result', () => {
    const previousResults = [
      {
        actuals: [10],
        id: 1,
        task: [5, 5, 0, 10],
        timeTaken: 2.2,
      },
    ];
    const resultInfo = {
      newRecordInfo: RECORD_NEW,
      text: 'Result Info Text',
    };

    let component;
    act(() => {
      component = renderer.create(
        <ThemeProvider theme={theme}>
          <Finished
            levelIndex={0}
            opIndexes={[0]}
            previousResults={previousResults}
            resultInfo={resultInfo}
            timeAllowed={600}
            timeLeft={100}
            totalProblems={20}
          />
        </ThemeProvider>,
      );
    });

    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });

  test('should render when there is a mix of correct and incorrect results', () => {
    const previousResults = [
      {
        actuals: [5], // single incorrect
        id: 1,
        task: [5, 5, 0, 10],
        timeTaken: 2.2,
      },
      {
        actuals: [10], // single correct
        id: 2,
        task: [5, 5, 0, 10],
        timeTaken: 2.2,
      },
      {
        actuals: [10, 5, 4, 3], // correct with some wrong
        id: 3,
        task: [5, 5, 0, 10],
        timeTaken: 2.2,
      },
    ];
    const resultInfo = {
      newRecordInfo: RECORD_NEW,
      text: 'Result Info Text',
    };
    db.getScores.mockReturnValueOnce([
      {
        key: '0-01',
        timePerQuestion: 2,
      },
      {
        key: '0-02',
        timePerQuestion: 0.5,
      },
      {
        key: '0-01',
        timePerQuestion: 1,
      },
    ]);

    let component;
    act(() => {
      component = renderer.create(
        <ThemeProvider theme={theme}>
          <Finished
            levelIndex={0}
            opIndexes={[0]}
            previousResults={previousResults}
            resultInfo={resultInfo}
            timeAllowed={600}
            timeLeft={100}
            totalProblems={20}
          />
        </ThemeProvider>,
      );
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
      newRecordInfo: RECORD_NEW,
      text: 'Result Info Text',
    };
    // But scoreBarTimes latest is 2.9 (Silver)
    const scoreBarTimes = [
      {
        date: Date.now(),
        timePerQuestion: 2.9,
      },
    ];

    let component;
    act(() => {
      component = renderer.create(
        <ThemeProvider theme={theme}>
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
        </ThemeProvider>,
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
      newRecordInfo: RECORD_MISS,
      text: 'Result Info Text',
    };

    let component;
    act(() => {
      component = renderer.create(
        <ThemeProvider theme={theme}>
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
        </ThemeProvider>,
      );
    });

    const tree = component.toJSON();
    const stringified = JSON.stringify(tree);
    expect(stringified).toContain('Gold Badge');
  });

  test('should render unknown newRecordInfo fallback', () => {
    const previousResults = [
      {
        actuals: [10],
        id: 1,
        task: [5, 5, 0, 10],
        timeTaken: 2.2,
      },
    ];
    const resultInfo = {
      newRecordInfo: 'UNKNOWN_RECORD_INFO',
      text: 'Unknown text',
    };

    let component;
    act(() => {
      component = renderer.create(
        <ThemeProvider theme={theme}>
          <Finished
            levelIndex={0}
            opIndexes={[0]}
            previousResults={previousResults}
            resultInfo={resultInfo}
            timeAllowed={600}
            timeLeft={100}
            totalProblems={20}
          />
        </ThemeProvider>,
      );
    });

    const tree = component.toJSON();
    const stringified = JSON.stringify(tree);
    expect(stringified).toContain('Unknown newRecordInfo UNKNOWN_RECORD_INFO in switch case');
  });
});
