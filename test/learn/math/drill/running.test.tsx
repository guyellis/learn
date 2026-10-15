import { createTheme, ThemeProvider } from '@mui/material/styles';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import Running, { type RunningProps } from '../../../../src/learn/math/drill/running.js';
import type {
  DrillTask,
  NewRecordComparison,
  PreviousResult,
} from '../../../../src/learn/math/drill/types.js';

const theme = createTheme();

describe('Running', () => {
  const currentTask: DrillTask = [2, 3, 0, 5];
  const newRecord: NewRecordComparison = {
    currentTimePerQuestion: 1.5,
    existingRecordTimePerQuestion: 2.0,
    isNewRecord: false,
  };
  const previousResults: PreviousResult[] = [
    {
      actuals: [3],
      id: 1,
      task: [1, 2, 0, 3],
      timeTaken: 1.2,
    },
  ];

  const defaultProps: RunningProps = {
    checkAnswer: vi.fn(),
    currentTask,
    levelIndex: 0,
    newRecord,
    opIndexes: [0],
    previousResults,
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
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Running {...defaultProps} currentTask={undefined} />
      </ThemeProvider>,
    );

    expect(container.firstChild).toBeNull();
    expect(spy).toHaveBeenCalledWith('No currentTask defined in renderRunning');
    spy.mockRestore();
  });

  test('should trigger green flash on correct answer tap and return to normal after 300ms', async () => {
    const checkAnswer = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <Running {...defaultProps} checkAnswer={checkAnswer} />
      </ThemeProvider>,
    );

    const container = screen.getByTestId('quiz-area-container');
    const buttons = screen.getAllByRole('button');
    const correctButton = buttons.find((btn) => btn.textContent === '5')!;

    fireEvent.click(correctButton);
    expect(checkAnswer).toHaveBeenCalledWith('5');

    // Flashing state is true
    expect(container.getAttribute('data-flashing')).toBe('true');

    // Trigger another correct tap while still flashing to exercise clearTimeout
    fireEvent.click(correctButton);
    expect(container.getAttribute('data-flashing')).toBe('true');

    // After 300ms, returns to false
    await waitFor(
      () => {
        expect(container.getAttribute('data-flashing')).toBe('false');
      },
      { timeout: 1000 },
    );
  });

  test('should not trigger flash on wrong answer tap', () => {
    const checkAnswer = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <Running {...defaultProps} checkAnswer={checkAnswer} />
      </ThemeProvider>,
    );

    const container = screen.getByTestId('quiz-area-container');
    const buttons = screen.getAllByRole('button');
    const wrongButton = buttons.find((btn) => btn.textContent !== '5')!;

    fireEvent.click(wrongButton);
    expect(checkAnswer).toHaveBeenCalledWith(wrongButton.textContent);
    expect(container.getAttribute('data-flashing')).toBe('false');
  });

  test('should skip flash when user prefers reduced motion', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
    }));

    const checkAnswer = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <Running {...defaultProps} checkAnswer={checkAnswer} />
      </ThemeProvider>,
    );

    const container = screen.getByTestId('quiz-area-container');
    const buttons = screen.getAllByRole('button');
    const correctButton = buttons.find((btn) => btn.textContent === '5')!;

    fireEvent.click(correctButton);
    expect(checkAnswer).toHaveBeenCalledWith('5');

    // Should NOT flash because prefers-reduced-motion is true
    expect(container.getAttribute('data-flashing')).toBe('false');

    window.matchMedia = originalMatchMedia;
  });

  test('should clear timer on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');

    const { unmount } = render(
      <ThemeProvider theme={theme}>
        <Running {...defaultProps} />
      </ThemeProvider>,
    );

    const buttons = screen.getAllByRole('button');
    const correctButton = buttons.find((btn) => btn.textContent === '5')!;
    fireEvent.click(correctButton);

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
