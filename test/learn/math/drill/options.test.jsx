import React from 'react';
import renderer, { act } from 'react-test-renderer';
import MuiThemeProviderPkg from 'material-ui/styles/MuiThemeProvider';
import getMuiThemePkg from 'material-ui/styles/getMuiTheme';
import lightBaseThemePkg from 'material-ui/styles/baseThemes/lightBaseTheme';
import db from '../../../../src/learn/db/index.js';
import Options from '../../../../src/learn/math/drill/options.jsx';

const MuiThemeProvider = MuiThemeProviderPkg.default || MuiThemeProviderPkg;
const getMuiTheme = getMuiThemePkg.default || getMuiThemePkg;
const lightBaseTheme = lightBaseThemePkg.default || lightBaseThemePkg;

const muiTheme = getMuiTheme(lightBaseTheme);

vi.mock('material-ui/internal/EnhancedSwitch');

describe('Options', () => {
  const defaultProps = {
    largeKeyboard: true,
    levelIndex: 0,
    minutes: '1',
    onChange: vi.fn(),
    onscreenKeyboard: true,
    onStart: vi.fn(),
    opIndexes: [0],
    setParentState: vi.fn(),
    totalProblems: '20',
    userName: 'Tester',
  };

  test('should clear record history when clear button is clicked', () => {
    const clearScoresMock = vi.spyOn(db, 'clearScores').mockImplementation(() => {});

    let component;
    act(() => {
      component = renderer.create(
        <MuiThemeProvider muiTheme={muiTheme}>
          <Options {...defaultProps} />
        </MuiThemeProvider>,
      );
    });

    const button = component.root.findByProps({ id: 'clear-record-history' });
    act(() => {
      button.props.onClick();
    });

    expect(clearScoresMock).toHaveBeenCalled();
    clearScoresMock.mockRestore();
  });

  test('should toggle opIndex when operation button clicked', () => {
    let component;
    act(() => {
      component = renderer.create(
        <MuiThemeProvider muiTheme={muiTheme}>
          <Options {...defaultProps} opIndexes={[0, 1]} />
        </MuiThemeProvider>,
      );
    });

    // click operation button
    const fabButtons = component.root.findAllByType('button');
    // First 26 are alphabet A-Z, next 4 are operations (+, -, x, /)
    const plusButton = fabButtons[26];
    act(() => {
      plusButton.props.onClick();
    });

    expect(defaultProps.setParentState).toHaveBeenCalled();
  });
});
