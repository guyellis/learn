import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import db from '../../../../src/learn/db/index.js';
import Options from '../../../../src/learn/math/drill/options.jsx';

const theme = createTheme();

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
        <ThemeProvider theme={theme}>
          <Options {...defaultProps} />
        </ThemeProvider>,
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
        <ThemeProvider theme={theme}>
          <Options {...defaultProps} opIndexes={[0, 1]} />
        </ThemeProvider>,
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
