import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
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

  test('should clear record history when clear button is clicked', async () => {
    const user = userEvent.setup();
    const clearScoresMock = vi.spyOn(db, 'clearScores').mockImplementation(() => {});

    render(
      <ThemeProvider theme={theme}>
        <Options {...defaultProps} />
      </ThemeProvider>,
    );

    const button = document.getElementById('clear-record-history');
    await user.click(button);

    expect(clearScoresMock).toHaveBeenCalled();
    clearScoresMock.mockRestore();
  });

  test('should toggle opIndex when operation button clicked', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider theme={theme}>
        <Options {...defaultProps} opIndexes={[0, 1]} />
      </ThemeProvider>,
    );

    const plusButton = screen.getByRole('button', { name: '+' });
    await user.click(plusButton);

    expect(defaultProps.setParentState).toHaveBeenCalled();
  });
});
