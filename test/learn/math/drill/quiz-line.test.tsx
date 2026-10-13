import { createTheme, ThemeProvider } from '@mui/material/styles';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import QuizLine from '../../../../src/learn/math/drill/quiz-line.js';
import type {
  DrillTask,
  NewRecordComparison,
  PreviousResult,
} from '../../../../src/learn/math/drill/types.js';

const theme = createTheme();

describe('QuizLine', () => {
  const defaultProblem: DrillTask = [1, 1, 0, 2];

  test('should render initial state without keyboard and handle text input and button submit', async () => {
    const user = userEvent.setup();
    const checkAnswer = vi.fn();
    const newRecord: NewRecordComparison = {
      currentTimePerQuestion: 1.1,
      existingRecordTimePerQuestion: 1,
      isNewRecord: false,
    };

    render(
      <ThemeProvider theme={theme}>
        <QuizLine
          checkAnswer={checkAnswer}
          largeKeyboard={false}
          newRecord={newRecord}
          onscreenKeyboard={false}
          problem={defaultProblem}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText('Ready for your first answer...')).toBeDefined();
    expect(screen.getByText('Current Speed 1.1 and Record 1')).toBeDefined();

    const input = document.getElementById('answer-number') as HTMLInputElement;
    expect(input).toBeDefined();

    await user.type(input, '2');
    expect(input.value).toBe('2');

    const checkButton = screen.getByRole('button', { name: /Check Answer/i });
    await user.click(checkButton);

    expect(checkAnswer).toHaveBeenCalledWith('2');
    expect(input.value).toBe('');
  });

  test('should handle enter key press in answer input', () => {
    const checkAnswer = vi.fn();
    const newRecord: NewRecordComparison = {
      currentTimePerQuestion: 1.1,
      existingRecordTimePerQuestion: 1,
      isNewRecord: false,
    };

    render(
      <ThemeProvider theme={theme}>
        <QuizLine
          checkAnswer={checkAnswer}
          largeKeyboard={false}
          newRecord={newRecord}
          onscreenKeyboard={false}
          problem={defaultProblem}
        />
      </ThemeProvider>,
    );

    const input = document.getElementById('answer-number') as HTMLInputElement;

    fireEvent.keyPress(input, { charCode: 65, key: 'a' });
    expect(checkAnswer).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { name: 'answer', value: '42' } });
    fireEvent.keyPress(input, { charCode: 13, key: 'Enter' });
    expect(checkAnswer).toHaveBeenCalledWith('42');
  });

  test('should handle onscreen keyboard typing, backspace, enter, and invalid keys', () => {
    const checkAnswer = vi.fn();
    const newRecord: NewRecordComparison = {
      currentTimePerQuestion: NaN,
      existingRecordTimePerQuestion: 0,
      isNewRecord: true,
    };
    const quizLineRef = React.createRef<QuizLine>();

    render(
      <ThemeProvider theme={theme}>
        <QuizLine
          checkAnswer={checkAnswer}
          largeKeyboard={false}
          newRecord={newRecord}
          onscreenKeyboard
          problem={defaultProblem}
          ref={quizLineRef}
        />
      </ThemeProvider>,
    );

    const answerSpan = screen.getByText('=').nextElementSibling;

    expect(screen.getByText('Current Speed [none] and Record [none] NEW RECORD!')).toBeDefined();
    expect(answerSpan?.textContent).toBe('?');

    const instance = quizLineRef.current!;

    // Type digits
    act(() => {
      instance.keyPress(1);
    });
    expect(answerSpan?.textContent).toBe('1');

    act(() => {
      instance.keyPress('5');
    });
    expect(answerSpan?.textContent).toBe('15');

    // Backspace
    act(() => {
      instance.keyPress('back');
    });
    expect(answerSpan?.textContent).toBe('1');

    // Backspace again to empty
    act(() => {
      instance.keyPress('back');
    });
    expect(answerSpan?.textContent).toBe('?');

    // Backspace on empty does nothing
    act(() => {
      instance.keyPress('back');
    });
    expect(answerSpan?.textContent).toBe('?');

    // Type 9 and submit with enter
    act(() => {
      instance.keyPress(9);
    });
    act(() => {
      instance.keyPress('enter');
    });
    expect(checkAnswer).toHaveBeenCalledWith('9');
    expect(answerSpan?.textContent).toBe('?');

    // Unknown key logs a warning
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    act(() => {
      instance.keyPress('unknown-key');
    });
    expect(warnSpy).toHaveBeenCalledWith('Unknown key in keyPress unknown-key');
    warnSpy.mockRestore();
  });

  test('should render correct and incorrect last results', () => {
    const checkAnswer = vi.fn();
    const newRecord: NewRecordComparison = {
      currentTimePerQuestion: 2,
      existingRecordTimePerQuestion: 3,
      isNewRecord: false,
    };
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
        <QuizLine
          checkAnswer={checkAnswer}
          largeKeyboard={false}
          lastResult={correctResult}
          newRecord={newRecord}
          onscreenKeyboard={false}
          problem={defaultProblem}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText('1.5 seconds')).toBeDefined();
    expect(screen.getByText('\u2714')).toBeDefined();

    rerender(
      <ThemeProvider theme={theme}>
        <QuizLine
          checkAnswer={checkAnswer}
          largeKeyboard={false}
          lastResult={incorrectResult}
          newRecord={newRecord}
          onscreenKeyboard={false}
          problem={defaultProblem}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText('2.5 seconds')).toBeDefined();
    expect(screen.getByText('\u2717')).toBeDefined();
  });
});
