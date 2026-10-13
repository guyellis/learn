import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import React from 'react';
import type { MockInstance } from 'vitest';
import constants from '../../../../src/learn/common/constants.js';
import db from '../../../../src/learn/db/index.js';
import Finished from '../../../../src/learn/math/drill/finished.js';
import type {
  PreviousResult,
  ResultInfo,
  ScoreBarTime,
} from '../../../../src/learn/math/drill/types.js';

const theme = createTheme();

const { RECORD_MISS, RECORD_NEW } = constants;

describe('Finished', () => {
  let getScoresSpy: MockInstance;

  beforeEach(() => {
    getScoresSpy = vi.spyOn(db, 'getScores').mockReturnValue([]);
  });

  afterEach(() => {
    getScoresSpy.mockRestore();
  });

  test('should render when there is a single incorrect result', () => {
    const previousResults: PreviousResult[] = [
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

    render(
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

    expect(screen.getByRole('heading', { level: 1, name: 'Finished' })).toBeDefined();
    expect(screen.getByText('Result Info Text')).toBeDefined();
    expect(
      screen.getByText(/You had 100 seconds left out of the 600 seconds allowed/i),
    ).toBeDefined();
    expect(screen.getByText(/You correctly answered 0 of the 20 problems/i)).toBeDefined();
  });

  test('should render when there is a single correct result', () => {
    const previousResults: PreviousResult[] = [
      {
        actuals: [10],
        id: 1,
        task: [5, 5, 0, 10],
        timeTaken: 2.2,
      },
    ];
    const resultInfo: ResultInfo = {
      newRecordInfo: RECORD_NEW,
      text: 'Result Info Text',
    };

    render(
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

    expect(screen.getByRole('heading', { level: 1, name: 'Finished' })).toBeDefined();
    expect(screen.getByText('Result Info Text')).toBeDefined();
    expect(
      screen.getByText(/You had 100 seconds left out of the 600 seconds allowed/i),
    ).toBeDefined();
    expect(screen.getByText(/You correctly answered 1 of the 20 problems/i)).toBeDefined();
  });

  test('should render when there is a mix of correct and incorrect results', () => {
    const previousResults: PreviousResult[] = [
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
    const resultInfo: ResultInfo = {
      newRecordInfo: RECORD_NEW,
      text: 'Result Info Text',
    };
    getScoresSpy.mockReturnValueOnce([
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

    render(
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

    expect(screen.getByRole('heading', { level: 1, name: 'Finished' })).toBeDefined();
    expect(screen.getByText('Result Info Text')).toBeDefined();
    expect(
      screen.getByText(/You had 100 seconds left out of the 600 seconds allowed/i),
    ).toBeDefined();
    expect(screen.getByText(/You correctly answered 2 of the 20 problems/i)).toBeDefined();
    expect(
      screen.getByRole('heading', {
        level: 4,
        name: 'The problem that took you the longest to answer',
      }),
    ).toBeDefined();
  });

  test('should use latest scoreBarTimes timePerQuestion for FinishedBadge when correct answers > 9', () => {
    // 10 correct answers where individual times sum to 31.0s (3.1s average = Bronze)
    const previousResults: PreviousResult[] = Array.from({ length: 10 }, (_, id) => ({
      actuals: [10],
      id,
      task: [5, 5, 0, 10],
      timeTaken: 3.1,
    }));
    const resultInfo: ResultInfo = {
      newRecordInfo: RECORD_NEW,
      text: 'Result Info Text',
    };
    // But scoreBarTimes latest is 2.9 (Silver)
    const scoreBarTimes: ScoreBarTime[] = [
      {
        date: Date.now(),
        timePerQuestion: 2.9,
      },
    ];

    render(
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

    expect(screen.getByText(/Silver Badge/i)).toBeDefined();
    expect(screen.queryByText(/Bronze Badge/i)).toBeNull();
  });

  test('should fallback to calculatedTimePerQuestion when scoreBarTimes is empty and correct answers > 9', () => {
    const previousResults: PreviousResult[] = Array.from({ length: 10 }, (_, id) => ({
      actuals: [10],
      id,
      task: [5, 5, 0, 10],
      timeTaken: 1.5,
    }));
    const resultInfo: ResultInfo = {
      newRecordInfo: RECORD_MISS,
      text: 'Result Info Text',
    };

    render(
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

    expect(screen.getByText(/Gold Badge/i)).toBeDefined();
  });

  test('should render unknown newRecordInfo fallback', () => {
    const previousResults: PreviousResult[] = [
      {
        actuals: [10],
        id: 1,
        task: [5, 5, 0, 10],
        timeTaken: 2.2,
      },
    ];
    const resultInfo: ResultInfo = {
      newRecordInfo: 'UNKNOWN_RECORD_INFO',
      text: 'Unknown text',
    };

    render(
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

    expect(
      screen.getByText(/Unknown newRecordInfo UNKNOWN_RECORD_INFO in switch case/i),
    ).toBeDefined();
  });
});
