import { createTheme, ThemeProvider } from '@mui/material/styles';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import db from '../../../../src/learn/db/index.js';
import ScoreBoard from '../../../../src/learn/math/drill/scoreboard.jsx';

const theme = createTheme();

describe('ScoreBoard', () => {
  beforeEach(() => {
    db.getScores = vi.fn();
  });

  afterEach(() => {
    db.getScores.mockClear();
  });

  test('should render showScoreBoard', () => {
    db.getScores.mockReturnValueOnce([
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

    expect(screen.getByRole('button', { name: /Clear Record History/i })).toBeDefined();
    expect(screen.getByRole('heading', { level: 3, name: 'Scoreboard' })).toBeDefined();
    expect(screen.getByRole('rowheader', { name: 'A' })).toBeDefined();
  });

  test('should clear record history when clear button is clicked', () => {
    db.getScores.mockReturnValue([
      {
        correctCount: 10,
        levelIndex: 0,
        opIndexes: [0],
        timePerQuestion: 6,
      },
    ]);
    db.clearScores = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <ScoreBoard />
      </ThemeProvider>,
    );

    const button = document.getElementById('clear-record-history');
    fireEvent.click(button);

    expect(db.clearScores).toHaveBeenCalled();
  });
});
