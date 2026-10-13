import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import React from 'react';
import QuizLine from '../../../../src/learn/math/drill/quiz-line.js';
import type { DrillTask, NewRecordComparison } from '../../../../src/learn/math/drill/types.js';

const theme = createTheme();

test('Badge totals should be rendered', () => {
  const newRecord: NewRecordComparison = {
    currentTimePerQuestion: 1.1,
    existingRecordTimePerQuestion: 1,
    isNewRecord: false,
  };
  const problem: DrillTask = [1, 1, 0, 2];

  render(
    <ThemeProvider theme={theme}>
      <QuizLine
        checkAnswer={vi.fn()}
        largeKeyboard={false}
        newRecord={newRecord}
        onscreenKeyboard={false}
        problem={problem}
      />
    </ThemeProvider>,
  );

  expect(screen.getByText('Ready for your first answer...')).toBeDefined();
  expect(screen.getByText('Current Speed 1.1 and Record 1')).toBeDefined();
  expect(screen.getByRole('button', { name: /Check Answer/i })).toBeDefined();
  expect(document.getElementById('answer-number')).toBeDefined();
});
