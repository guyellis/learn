import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import type { MockInstance } from 'vitest';
import db from '../../../../src/learn/db/index.js';
import ScoreBoard from '../../../../src/learn/math/drill/scoreboard.js';

const theme = createTheme();

describe('ScoreBoard', () => {
  let getScoresSpy: MockInstance;
  let clearScoresSpy: MockInstance;

  beforeEach(() => {
    getScoresSpy = vi.spyOn(db, 'getScores').mockReturnValue([]);
    clearScoresSpy = vi.spyOn(db, 'clearScores').mockImplementation(() => {});
  });

  afterEach(() => {
    getScoresSpy.mockRestore();
    clearScoresSpy.mockRestore();
  });

  test('should render showScoreBoard', () => {
    getScoresSpy.mockReturnValueOnce([
      {
        correctCount: 10,
        levelIndex: 0,
        opIndexes: [0],
        timePerQuestion: 6,
      },
      {
        correctCount: 10,
        levelIndex: 2,
        opIndexes: [1],
        timePerQuestion: 6,
      },
    ]);

    render(
      <ThemeProvider theme={theme}>
        <ScoreBoard />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button', { name: /Clear Record History/i })).toBeDefined();
    expect(screen.getByRole('heading', { level: 3, name: 'Scoreboard' })).toBeDefined();
    expect(screen.getByRole('rowheader', { name: 'A' })).toBeDefined();
    expect(screen.getByRole('rowheader', { name: 'C' })).toBeDefined();
  });

  test('should clear record history when clear button is clicked', async () => {
    const user = userEvent.setup();
    getScoresSpy.mockReturnValue([
      {
        correctCount: 10,
        levelIndex: 0,
        opIndexes: [0],
        timePerQuestion: 6,
      },
    ]);

    render(
      <ThemeProvider theme={theme}>
        <ScoreBoard />
      </ThemeProvider>,
    );

    const button = document.getElementById('clear-record-history');
    await user.click(button!);

    expect(clearScoresSpy).toHaveBeenCalled();
  });
});
