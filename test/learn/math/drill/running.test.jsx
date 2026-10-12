import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Running from '../../../../src/learn/math/drill/running.jsx';

const theme = createTheme();

describe('Running', () => {
  const defaultProps = {
    checkAnswer: vi.fn(),
    currentTask: [2, 3, 0, 5],
    largeKeyboard: false,
    levelIndex: 0,
    newRecord: {
      isNewRecord: false,
      currentTimePerQuestion: 1.5,
      existingRecordTimePerQuestion: 2.0,
    },
    onscreenKeyboard: false,
    opIndexes: [0],
    previousResults: [
      {
        task: [1, 2, 0, 3],
        actuals: [3],
        timeTaken: 1.2,
        id: 1,
      },
    ],
    questionsRemaining: 19,
    timeLeft: 58,
  };

  test('should render the Running component with highlighted params', () => {
    let component;
    act(() => {
      component = renderer.create(
        <ThemeProvider theme={theme}>
          <Running {...defaultProps} />
        </ThemeProvider>
      );
    });

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should render multiple operations highlighted', () => {
    let component;
    act(() => {
      component = renderer.create(
        <ThemeProvider theme={theme}>
          <Running {...defaultProps} opIndexes={[0, 1]} levelIndex={1} />
        </ThemeProvider>
      );
    });

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should return null and warn when currentTask is not defined', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = Running({ ...defaultProps, currentTask: null });

    expect(result).toBeNull();
    expect(spy).toHaveBeenCalledWith('No currentTask defined in renderRunning');
    spy.mockRestore();
  });
});
