import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Running from '../../../../src/learn/math/drill/running.jsx';

const theme = createTheme();

describe('Running', () => {
  const defaultProps = {
    checkAnswer: vi.fn(),
    currentTask: [2, 3, 0, 5],
    largeKeyboard: false,
    levelIndex: 0,
    newRecord: {
      currentTimePerQuestion: 1.5,
      existingRecordTimePerQuestion: 2.0,
      isNewRecord: false,
    },
    onscreenKeyboard: false,
    opIndexes: [0],
    previousResults: [
      {
        actuals: [3],
        id: 1,
        task: [1, 2, 0, 3],
        timeTaken: 1.2,
      },
    ],
    questionsRemaining: 19,
    timeLeft: 58,
  };

  test('should render the Running component with highlighted params', () => {
    render(
      <ThemeProvider theme={theme}>
        <Running {...defaultProps} />
      </ThemeProvider>,
    );

    expect(screen.getByText('Level:')).toBeDefined();
    expect(screen.getByText('A')).toBeDefined();
    expect(screen.getByText('Operation(s):')).toBeDefined();
    expect(screen.getAllByText('+').length).toBeGreaterThan(0);
    expect(screen.getByText('58')).toBeDefined();
  });

  test('should render multiple operations highlighted', () => {
    render(
      <ThemeProvider theme={theme}>
        <Running {...defaultProps} levelIndex={1} opIndexes={[0, 1]} />
      </ThemeProvider>,
    );

    expect(screen.getByText('Level:')).toBeDefined();
    expect(screen.getByText('B')).toBeDefined();
    expect(screen.getByText('+,-')).toBeDefined();
  });

  test('should return null and warn when currentTask is not defined', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = Running({ ...defaultProps, currentTask: null });

    expect(result).toBeNull();
    expect(spy).toHaveBeenCalledWith('No currentTask defined in renderRunning');
    spy.mockRestore();
  });
});
