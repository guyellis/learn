import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import renderer, { act } from 'react-test-renderer';
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

    let component;
    act(() => {
      component = renderer.create(
        <ThemeProvider theme={theme}>
          <ScoreBoard />
        </ThemeProvider>,
      );
    });

    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
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

    let component;
    act(() => {
      component = renderer.create(
        <ThemeProvider theme={theme}>
          <ScoreBoard />
        </ThemeProvider>,
      );
    });

    const button = component.root.findByProps({ id: 'clear-record-history' });
    act(() => {
      button.props.onClick();
    });

    expect(db.clearScores).toHaveBeenCalled();
  });
});
