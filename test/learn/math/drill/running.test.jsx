import React from 'react';
import renderer, { act } from 'react-test-renderer';
import MuiThemeProviderPkg from 'material-ui/styles/MuiThemeProvider';
import getMuiThemePkg from 'material-ui/styles/getMuiTheme';
import lightBaseThemePkg from 'material-ui/styles/baseThemes/lightBaseTheme';
import Running from '../../../../src/learn/math/drill/running.jsx';

const MuiThemeProvider = MuiThemeProviderPkg.default || MuiThemeProviderPkg;
const getMuiTheme = getMuiThemePkg.default || getMuiThemePkg;
const lightBaseTheme = lightBaseThemePkg.default || lightBaseThemePkg;

const muiTheme = getMuiTheme(lightBaseTheme);

describe('Running', () => {
  const defaultProps = {
    checkAnswer: jest.fn(),
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
        <MuiThemeProvider muiTheme={muiTheme}>
          <Running {...defaultProps} />
        </MuiThemeProvider>
      );
    });

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should render multiple operations highlighted', () => {
    let component;
    act(() => {
      component = renderer.create(
        <MuiThemeProvider muiTheme={muiTheme}>
          <Running {...defaultProps} opIndexes={[0, 1]} levelIndex={1} />
        </MuiThemeProvider>
      );
    });

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should return null and warn when currentTask is not defined', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const result = Running({ ...defaultProps, currentTask: null });

    expect(result).toBeNull();
    expect(spy).toHaveBeenCalledWith('No currentTask defined in renderRunning');
    spy.mockRestore();
  });
});
