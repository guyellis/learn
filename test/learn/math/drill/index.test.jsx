import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Temporal } from '@js-temporal/polyfill';
import MuiThemeProviderPkg from 'material-ui/styles/MuiThemeProvider';
import getMuiThemePkg from 'material-ui/styles/getMuiTheme';
import lightBaseThemePkg from 'material-ui/styles/baseThemes/lightBaseTheme';
import Drill from '../../../../src/learn/math/drill/index.jsx';
import helper from '../../../../src/learn/math/drill/helper.js';

const MuiThemeProvider = MuiThemeProviderPkg.default || MuiThemeProviderPkg;
const getMuiTheme = getMuiThemePkg.default || getMuiThemePkg;
const lightBaseTheme = lightBaseThemePkg.default || lightBaseThemePkg;

const muiTheme = getMuiTheme(lightBaseTheme);

vi.mock('material-ui/internal/EnhancedSwitch');

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

  beforeEach(() => {
    // eslint-disable-next-line no-proto
    vi.spyOn(window.localStorage.__proto__, 'getItem')
      .mockReturnValue(JSON.stringify(savedOptions));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should render the Drill component', () => {
    let component;
    act(() => {
      component = renderer.create(
        <MuiThemeProvider muiTheme={muiTheme}>
          <Drill />
        </MuiThemeProvider>,
      );
    });

    const app = component.toJSON();
    expect(app).toMatchSnapshot();
  });

  test('should clear interval on unmount if timerId is active', () => {
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
    let component;
    act(() => {
      component = renderer.create(
        <MuiThemeProvider muiTheme={muiTheme}>
          <Drill />
        </MuiThemeProvider>,
      );
    });

    const instance = component.root.findByType(Drill).instance;
    act(() => {
      instance.onStart();
    });

    const { timerId } = instance.state;
    expect(timerId).toBeDefined();

    act(() => {
      component.unmount();
    });

    expect(clearIntervalSpy).toHaveBeenCalledWith(timerId);
  });

  test('should not call clearInterval on unmount if timerId is not set', () => {
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
    let component;
    act(() => {
      component = renderer.create(
        <MuiThemeProvider muiTheme={muiTheme}>
          <Drill />
        </MuiThemeProvider>,
      );
    });

    act(() => {
      component.unmount();
    });

    expect(clearIntervalSpy).not.toHaveBeenCalled();
  });

  test('should update timeLeft on interval when timeLeft > 0', () => {
    let component;
    act(() => {
      component = renderer.create(
        <MuiThemeProvider muiTheme={muiTheme}>
          <Drill />
        </MuiThemeProvider>,
      );
    });

    const instance = component.root.findByType(Drill).instance;
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
    let component;
    act(() => {
      component = renderer.create(
        <MuiThemeProvider muiTheme={muiTheme}>
          <Drill />
        </MuiThemeProvider>,
      );
    });

    const instance = component.root.findByType(Drill).instance;
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
    let component;
    act(() => {
      component = renderer.create(
        <MuiThemeProvider muiTheme={muiTheme}>
          <Drill />
        </MuiThemeProvider>,
      );
    });

    const instance = component.root.findByType(Drill).instance;
    act(() => {
      instance.onChange({ target: { name: 'largeKeyboard', type: 'checkbox', checked: false } });
    });
    expect(instance.state.largeKeyboard).toBe(false);

    act(() => {
      instance.onChange({ target: { name: 'userName', type: 'text', value: 'Alice' } });
    });
    expect(instance.state.userName).toBe('Alice');
  });

  test('should set parent state and save', () => {
    let component;
    act(() => {
      component = renderer.create(
        <MuiThemeProvider muiTheme={muiTheme}>
          <Drill />
        </MuiThemeProvider>,
      );
    });

    const instance = component.root.findByType(Drill).instance;
    act(() => {
      instance.setParentState({ minutes: '2' });
    });
    expect(instance.state.minutes).toBe('2');
  });

  test('should process correct and incorrect answers and finish quiz', () => {
    let component;
    act(() => {
      component = renderer.create(
        <MuiThemeProvider muiTheme={muiTheme}>
          <Drill />
        </MuiThemeProvider>,
      );
    });

    const instance = component.root.findByType(Drill).instance;
    act(() => {
      instance.onStart();
    });

    // Set a known task: 2 + 3 = 5 (task format: [left, right, opIndex, expected])
    act(() => {
      instance.setState({
        currentTask: [2, 3, 0, 5],
        totalProblems: '2',
        correctCount: 0,
        previousResults: [],
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
    let component;
    act(() => {
      component = renderer.create(
        <MuiThemeProvider muiTheme={muiTheme}>
          <Drill />
        </MuiThemeProvider>,
      );
    });

    const instance = component.root.findByType(Drill).instance;
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
    let component;
    act(() => {
      component = renderer.create(
        <MuiThemeProvider muiTheme={muiTheme}>
          <Drill />
        </MuiThemeProvider>,
      );
    });

    const instance = component.root.findByType(Drill).instance;
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
    let component;
    act(() => {
      component = renderer.create(
        <MuiThemeProvider muiTheme={muiTheme}>
          <Drill />
        </MuiThemeProvider>,
      );
    });

    const instance = component.root.findByType(Drill).instance;

    act(() => {
      instance.onStart();
    });
    expect(component.toJSON()).toBeDefined();

    act(() => {
      instance.endQuiz();
    });
    expect(component.toJSON()).toBeDefined();

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    act(() => {
      instance.setState({ currentAction: 'unknown_action' });
    });
    expect(component.toJSON()).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  test('MathDrill.save handles edge cases safely', () => {
    expect(() => Drill.save(null)).not.toThrow();
    expect(() => Drill.save({})).not.toThrow();
  });
});
