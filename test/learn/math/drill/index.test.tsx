import { createTheme, ThemeProvider } from '@mui/material/styles';
import { act, render, screen } from '@testing-library/react';
import React from 'react';
import helper from '../../../../src/learn/math/drill/helper.js';
import Drill, { type MathDrillProps } from '../../../../src/learn/math/drill/index.js';

const theme = createTheme();

describe('Drill', () => {
  const savedOptions = {
    largeKeyboard: true,
    levelIndex: 0, // A
    minutes: '1',
    onscreenKeyboard: true,
    opIndexes: [0], // A
    totalProblems: '20',
    userName: 'my name',
  };

  const renderDrill = () => {
    const drillRef = React.createRef<Drill>();
    const utils = render(
      <ThemeProvider theme={theme}>
        <Drill {...({ ref: drillRef } as unknown as MathDrillProps)} />
      </ThemeProvider>,
    );
    return { ...utils, instance: drillRef.current! };
  };

  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(savedOptions));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should render the Drill component', () => {
    renderDrill();
    expect(screen.getByRole('heading', { level: 2, name: /Level/i })).toBeDefined();
    expect(screen.getByRole('heading', { level: 2, name: /Operation/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Start/i })).toBeDefined();
  });

  test('should clear interval on unmount if timerId is active', () => {
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
    const { instance, unmount } = renderDrill();

    act(() => {
      instance.onStart();
    });

    const { timerId } = instance.state;
    expect(timerId).toBeDefined();

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalledWith(timerId);
  });

  test('should not call clearInterval on unmount if timerId is not set', () => {
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
    const { unmount } = renderDrill();

    unmount();

    expect(clearIntervalSpy).not.toHaveBeenCalled();
  });

  test('should update timeLeft on interval when timeLeft > 0', () => {
    const { instance } = renderDrill();

    act(() => {
      instance.setState({
        endTime: Temporal.Now.instant().add(Temporal.Duration.from({ seconds: 30 })),
      });
    });
    act(() => {
      instance.onInterval();
    });

    expect(instance.state.timeLeft).toBeGreaterThan(0);
  });

  test('should end quiz on interval when timeLeft <= 0', () => {
    const { instance } = renderDrill();

    act(() => {
      instance.onStart();
    });
    const endQuizSpy = vi.spyOn(instance, 'endQuiz');
    act(() => {
      instance.setState({
        endTime: Temporal.Now.instant().subtract(Temporal.Duration.from({ seconds: 1 })),
      });
    });
    act(() => {
      instance.onInterval();
    });

    expect(endQuizSpy).toHaveBeenCalled();
  });

  test('should handle onChange for checkbox and input fields', () => {
    const { instance } = renderDrill();

    act(() => {
      instance.onChange({
        target: { checked: false, name: 'largeKeyboard', type: 'checkbox' },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });
    expect(instance.state.largeKeyboard).toBe(false);

    act(() => {
      instance.onChange({
        target: { name: 'userName', type: 'text', value: 'Alice' },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });
    expect(instance.state.userName).toBe('Alice');
  });

  test('should set parent state and save', () => {
    const { instance } = renderDrill();

    act(() => {
      instance.setParentState({ minutes: '2' });
    });
    expect(instance.state.minutes).toBe('2');
  });

  test('should process correct and incorrect answers and finish quiz', () => {
    const { instance } = renderDrill();

    act(() => {
      instance.onStart();
    });

    // Set a known task: 2 + 3 = 5 (task format: [left, right, opIndex, expected])
    act(() => {
      instance.setState({
        correctCount: 0,
        currentTask: [2, 3, 0, 5],
        previousResults: [],
        totalProblems: '2',
      });
    });
    act(() => {
      instance.checkAnswer('4');
    });
    expect(instance.state.correct).toBe(false);
    expect(instance.state.previousResults).toHaveLength(1);

    // Wrong answer again on same task updates actuals
    act(() => {
      instance.checkAnswer('6');
    });
    expect(instance.state.previousResults[0].actuals).toEqual([6, 4]);

    // Correct answer for problem 1
    act(() => {
      instance.checkAnswer('5');
    });
    expect(instance.state.correctCount).toBe(1);

    // Provide next problem and answer correctly to trigger endQuiz
    act(() => {
      instance.setState({
        currentTask: [1, 1, 0, 2],
      });
    });
    act(() => {
      instance.checkAnswer('2');
    });
    expect(instance.state.currentAction).toBe('finished');
  });

  test('should ignore non-numeric answer in checkAnswer', () => {
    const { instance } = renderDrill();

    act(() => {
      instance.onStart();
    });
    const previousState = { ...instance.state };
    act(() => {
      instance.checkAnswer('abc');
    });
    expect(instance.state.totalCount).toBe(previousState.totalCount);
  });

  test('should re-roll next task if it matches currentTask', () => {
    const { instance } = renderDrill();

    act(() => {
      instance.setState({
        currentTask: [1, 2, 0, 3],
        levelIndex: 0,
        opIndexes: [0],
      });
    });

    vi.spyOn(helper, 'getLowerUpper')
      .mockReturnValueOnce([1, 2, 0, 3])
      .mockReturnValueOnce([2, 4, 0, 6]);

    act(() => {
      instance.setNextTask();
    });

    expect(instance.state.currentTask).toEqual([2, 4, 0, 6]);
  });

  test('should render running and finished states, and handle unknown state', () => {
    const { container, instance } = renderDrill();

    act(() => {
      instance.onStart();
    });
    expect(screen.getByText(/Time Left:/i)).toBeDefined();

    act(() => {
      instance.endQuiz();
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Finished' })).toBeDefined();

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    act(() => {
      instance.setState({ currentAction: 'unknown_action' as unknown as 'start' });
    });
    expect(container.firstChild).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  test('MathDrill.save handles edge cases safely', () => {
    expect(() => Drill.save(null as unknown as Record<string, unknown>)).not.toThrow();
    expect(() => Drill.save({})).not.toThrow();
  });
});
