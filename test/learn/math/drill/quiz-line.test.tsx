import { createTheme, ThemeProvider } from '@mui/material/styles';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import QuizLine from '../../../../src/learn/math/drill/quiz-line.js';
import type { DrillTask, PreviousResult } from '../../../../src/learn/math/drill/types.js';

const theme = createTheme();

describe('QuizLine', () => {
  const defaultProblem: DrillTask = [1, 1, 0, 2];

  test('should render problem line and 9 answer choices in a grid', () => {
    const checkAnswer = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <QuizLine checkAnswer={checkAnswer} problem={defaultProblem} />
      </ThemeProvider>,
    );

    // Problem line
    expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('+')).toBeDefined();
    expect(screen.getByText('=')).toBeDefined();

    // 9 button cells
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(9);

    // The expected answer (2) is present in the grid
    const targetButton = buttons.find((btn) => btn.textContent === '2');
    expect(targetButton).toBeDefined();

    // Initial state has ready message
    expect(screen.getByText('Ready for your first answer...')).toBeDefined();
    expect(screen.queryByText(/Current Speed/)).toBeNull();
  });

  test('should disable a tapped wrong cell, display a red X, and ignore repeated taps', async () => {
    const user = userEvent.setup();
    const checkAnswer = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <QuizLine checkAnswer={checkAnswer} problem={defaultProblem} />
      </ThemeProvider>,
    );

    const buttons = screen.getAllByRole('button');
    const wrongButton = buttons.find((btn) => btn.textContent !== '2')!;
    const wrongAnswer = wrongButton.textContent!;

    await user.click(wrongButton);
    expect(checkAnswer).toHaveBeenCalledWith(wrongAnswer);
    expect(wrongButton.hasAttribute('disabled')).toBe(true);

    // Shows red X icon
    expect(screen.getByLabelText('incorrect')).toBeDefined();

    // Repeated click on disabled button should not trigger checkAnswer again
    checkAnswer.mockClear();
    fireEvent.click(wrongButton);
    expect(checkAnswer).not.toHaveBeenCalled();
  });

  test('should allow multiple wrong taps on different cells', async () => {
    const user = userEvent.setup();
    const checkAnswer = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <QuizLine checkAnswer={checkAnswer} problem={defaultProblem} />
      </ThemeProvider>,
    );

    const buttons = screen.getAllByRole('button');
    const wrongButtons = buttons.filter((btn) => btn.textContent !== '2');

    await user.click(wrongButtons[0]);
    expect(checkAnswer).toHaveBeenCalledWith(wrongButtons[0].textContent);
    expect(wrongButtons[0].hasAttribute('disabled')).toBe(true);

    await user.click(wrongButtons[1]);
    expect(checkAnswer).toHaveBeenCalledWith(wrongButtons[1].textContent);
    expect(wrongButtons[1].hasAttribute('disabled')).toBe(true);

    // Two incorrect icons rendered
    expect(screen.getAllByLabelText('incorrect')).toHaveLength(2);
  });

  test('should call checkAnswer on correct tap', async () => {
    const user = userEvent.setup();
    const checkAnswer = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <QuizLine checkAnswer={checkAnswer} problem={defaultProblem} />
      </ThemeProvider>,
    );

    const buttons = screen.getAllByRole('button');
    const correctButton = buttons.find((btn) => btn.textContent === '2')!;

    await user.click(correctButton);
    expect(checkAnswer).toHaveBeenCalledWith('2');
  });

  test('should reset disabled cells and regenerate choices when problem changes', async () => {
    const user = userEvent.setup();
    const checkAnswer = vi.fn();

    const { rerender } = render(
      <ThemeProvider theme={theme}>
        <QuizLine checkAnswer={checkAnswer} problem={defaultProblem} />
      </ThemeProvider>,
    );

    const buttons = screen.getAllByRole('button');
    const wrongButton = buttons.find((btn) => btn.textContent !== '2')!;
    await user.click(wrongButton);
    expect(wrongButton.hasAttribute('disabled')).toBe(true);

    // Problem advances to [2, 3, 0, 5]
    const nextProblem: DrillTask = [2, 3, 0, 5];
    rerender(
      <ThemeProvider theme={theme}>
        <QuizLine checkAnswer={checkAnswer} problem={nextProblem} />
      </ThemeProvider>,
    );

    // All cells should be enabled now and include 5
    const newButtons = screen.getAllByRole('button');
    expect(newButtons.every((btn) => !btn.hasAttribute('disabled'))).toBe(true);
    expect(screen.queryByLabelText('incorrect')).toBeNull();
    const hasFive = newButtons.some((btn) => btn.textContent === '5');
    expect(hasFive).toBe(true);
  });

  test('should reset when a previously encountered problem repeats later in the quiz', async () => {
    const user = userEvent.setup();
    const checkAnswer = vi.fn();

    const { rerender } = render(
      <ThemeProvider theme={theme}>
        <QuizLine checkAnswer={checkAnswer} problem={defaultProblem} />
      </ThemeProvider>,
    );

    const buttons = screen.getAllByRole('button');
    const wrongButton = buttons.find((btn) => btn.textContent !== '2')!;
    await user.click(wrongButton);
    expect(wrongButton.hasAttribute('disabled')).toBe(true);

    // Intermediate problem
    rerender(
      <ThemeProvider theme={theme}>
        <QuizLine checkAnswer={checkAnswer} problem={[3, 4, 0, 7]} />
      </ThemeProvider>,
    );

    // Back to original problem
    rerender(
      <ThemeProvider theme={theme}>
        <QuizLine checkAnswer={checkAnswer} problem={defaultProblem} />
      </ThemeProvider>,
    );

    const resetButtons = screen.getAllByRole('button');
    expect(resetButtons.every((btn) => !btn.hasAttribute('disabled'))).toBe(true);
    expect(screen.queryByLabelText('incorrect')).toBeNull();
  });

  test('should render correct and incorrect last results', () => {
    const checkAnswer = vi.fn();
    const correctResult: PreviousResult = {
      actuals: [2],
      id: 0,
      task: [1, 1, 0, 2],
      timeTaken: 1.5,
    };
    const incorrectResult: PreviousResult = {
      actuals: [3, 2],
      id: 1,
      task: [1, 1, 0, 2],
      timeTaken: 2.5,
    };

    const { rerender } = render(
      <ThemeProvider theme={theme}>
        <QuizLine checkAnswer={checkAnswer} lastResult={correctResult} problem={defaultProblem} />
      </ThemeProvider>,
    );

    expect(screen.getByText('1.5 seconds')).toBeDefined();
    expect(screen.getByText('\u2714')).toBeDefined();
    expect(screen.queryByText(/Current Speed/)).toBeNull();

    rerender(
      <ThemeProvider theme={theme}>
        <QuizLine checkAnswer={checkAnswer} lastResult={incorrectResult} problem={defaultProblem} />
      </ThemeProvider>,
    );

    expect(screen.getByText('2.5 seconds')).toBeDefined();
    expect(screen.getByText('\u2717')).toBeDefined();
    expect(screen.queryByText(/Current Speed/)).toBeNull();
  });

  test('should trigger radial glow on correct choice click and remove after 300ms', async () => {
    const checkAnswer = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <QuizLine checkAnswer={checkAnswer} problem={defaultProblem} />
      </ThemeProvider>,
    );

    const buttons = screen.getAllByRole('button');
    const correctButton = buttons.find((btn) => btn.textContent === '2')!;
    const otherButtons = buttons.filter((btn) => btn !== correctButton);

    fireEvent.click(correctButton);
    expect(correctButton.getAttribute('data-glowing')).toBe('true');
    expect(correctButton.querySelector('[data-testid="radial-glow"]')).not.toBeNull();

    for (const otherButton of otherButtons) {
      expect(otherButton.getAttribute('data-glowing')).toBe('false');
      expect(otherButton.querySelector('[data-testid="radial-glow"]')).toBeNull();
    }

    // Successive correct click clears previous timer and maintains glow
    fireEvent.click(correctButton);
    expect(correctButton.getAttribute('data-glowing')).toBe('true');

    await waitFor(
      () => {
        expect(correctButton.getAttribute('data-glowing')).toBe('false');
        expect(correctButton.querySelector('[data-testid="radial-glow"]')).toBeNull();
      },
      { timeout: 1000 },
    );
  });

  test('should not trigger radial glow when reduced motion is preferred', () => {
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
        <QuizLine checkAnswer={checkAnswer} problem={defaultProblem} />
      </ThemeProvider>,
    );

    const buttons = screen.getAllByRole('button');
    const correctButton = buttons.find((btn) => btn.textContent === '2')!;

    fireEvent.click(correctButton);
    expect(correctButton.getAttribute('data-glowing')).toBe('false');
    expect(screen.queryByTestId('radial-glow')).toBeNull();

    window.matchMedia = originalMatchMedia;
  });

  test('should clear timer on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
    const { unmount } = render(
      <ThemeProvider theme={theme}>
        <QuizLine checkAnswer={vi.fn()} problem={defaultProblem} />
      </ThemeProvider>,
    );

    const buttons = screen.getAllByRole('button');
    const correctButton = buttons.find((btn) => btn.textContent === '2')!;
    fireEvent.click(correctButton);

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
