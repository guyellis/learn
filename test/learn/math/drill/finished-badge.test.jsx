import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import React from 'react';
import FinishedBadge from '../../../../src/learn/math/drill/finished-badge.jsx';

const theme = createTheme();

describe('Finished Badge', () => {
  test('should be rendered on happy path', () => {
    render(
      <ThemeProvider theme={theme}>
        <FinishedBadge
          levelIndex={0}
          opIndexes={[0]}
          timePerQuestion={2.2}
          totalCorrectAnswers={10}
        />
      </ThemeProvider>,
    );

    expect(
      screen.getByText(/Congratulations on getting a new Silver Badge for Level A Addition!/i),
    ).toBeDefined();
    expect(screen.getByRole('button', { name: '+' })).toBeDefined();
  });

  test('should be rendered if multiple opIndexes', () => {
    render(
      <ThemeProvider theme={theme}>
        <FinishedBadge
          levelIndex={0}
          opIndexes={[0, 1]}
          timePerQuestion={2.2}
          totalCorrectAnswers={10}
        />
      </ThemeProvider>,
    );

    expect(
      screen.getByText(
        /Congratulations on getting a new Silver Badge for Level A Mixed Addition \/ Subtraction!/i,
      ),
    ).toBeDefined();
    expect(screen.getByRole('button', { name: 'M' })).toBeDefined();
  });

  test('should not be rendered if correct answers under 10', () => {
    render(
      <ThemeProvider theme={theme}>
        <FinishedBadge
          levelIndex={0}
          opIndexes={[0]}
          timePerQuestion={2.2}
          totalCorrectAnswers={9}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText(/You need 10 or more correct answers to earn a badge/i)).toBeDefined();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
