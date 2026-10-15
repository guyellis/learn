import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import db from '../../../../src/learn/db/index.js';
import Options, { type OptionsProps } from '../../../../src/learn/math/drill/options.js';

const theme = createTheme();

describe('Options', () => {
  const defaultProps: OptionsProps = {
    levelIndex: 0,
    minutes: '1',
    onChange: vi.fn(),
    onStart: vi.fn(),
    opIndexes: [0],
    setParentState: vi.fn(),
    totalProblems: '20',
    userName: 'Tester',
  };

  test('should clear record history when clear button is clicked', async () => {
    const user = userEvent.setup();
    const clearScoresMock = vi.spyOn(db, 'clearScores').mockImplementation(() => {});

    render(
      <ThemeProvider theme={theme}>
        <Options {...defaultProps} />
      </ThemeProvider>,
    );

    const button = document.getElementById('clear-record-history');
    await user.click(button!);

    expect(clearScoresMock).toHaveBeenCalled();
    clearScoresMock.mockRestore();
  });

  test('should toggle opIndex when operation button clicked', async () => {
    const user = userEvent.setup();
    const setParentState = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <Options {...defaultProps} opIndexes={[0, 1]} setParentState={setParentState} />
      </ThemeProvider>,
    );

    const plusButton = screen.getByRole('button', { name: '+' });
    await user.click(plusButton);

    expect(setParentState).toHaveBeenCalledWith({ opIndexes: [1] });
  });

  test('should add opIndex when unselected operation button is clicked', async () => {
    const user = userEvent.setup();
    const setParentState = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <Options {...defaultProps} opIndexes={[0]} setParentState={setParentState} />
      </ThemeProvider>,
    );

    const minusButton = screen.getByRole('button', { name: '-' });
    await user.click(minusButton);

    expect(setParentState).toHaveBeenCalledWith({ opIndexes: [0, 1] });
  });

  test('should not reduce opIndexes below 1 when clicking the only selected operation', async () => {
    const user = userEvent.setup();
    const setParentState = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <Options {...defaultProps} opIndexes={[0]} setParentState={setParentState} />
      </ThemeProvider>,
    );

    const plusButton = screen.getByRole('button', { name: '+' });
    await user.click(plusButton);

    expect(setParentState).toHaveBeenCalledWith({ opIndexes: [0] });
  });

  test('should update levelIndex when a level button is clicked', async () => {
    const user = userEvent.setup();
    const setParentState = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <Options {...defaultProps} setParentState={setParentState} />
      </ThemeProvider>,
    );

    const bButton = screen.getByRole('button', { name: 'B' });
    await user.click(bButton);

    expect(setParentState).toHaveBeenCalledWith({ levelIndex: 1 });
  });

  test('should not render keyboard switches', () => {
    render(
      <ThemeProvider theme={theme}>
        <Options {...defaultProps} />
      </ThemeProvider>,
    );

    expect(screen.queryByLabelText(/onscreen keyboard/i)).toBeNull();
    expect(screen.queryByLabelText(/Large Keyboard/i)).toBeNull();
  });
});
