import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import React from 'react';
import QuizLine from '../../../../src/learn/math/drill/quiz-line.jsx';

const theme = createTheme();

test('Badge totals should be rendered', () => {
  render(
    <ThemeProvider theme={theme}>
      <QuizLine
        checkAnswer={vi.fn()}
        largeKeyboard={false}
        newRecord={{
          currentTimePerQuestion: 1.1,
          existingRecordTimePerQuestion: 1,
          isNewRecord: false,
        }}
        onscreenKeyboard={false}
        problem={[1, 1, 0, 2]}
      />
    </ThemeProvider>,
  );

  expect(screen.getByText('Ready for your first answer...')).toBeDefined();
  expect(screen.getByText('Current Speed 1.1 and Record 1')).toBeDefined();
  expect(screen.getByRole('button', { name: /Check Answer/i })).toBeDefined();
  expect(document.getElementById('answer-number')).toBeDefined();
});
