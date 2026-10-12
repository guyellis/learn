import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import QuizLine from '../../../../src/learn/math/drill/quiz-line.jsx';

const theme = createTheme();

test('Badge totals should be rendered', () => {
  let component;
  act(() => {
    component = renderer.create(
      <ThemeProvider theme={theme}>
        <QuizLine
          checkAnswer={vi.fn()}
          newRecord={{
            isNewRecord: false,
            currentTimePerQuestion: 1.1,
            existingRecordTimePerQuestion: 1,
          }}
          onscreenKeyboard={false}
          largeKeyboard={false}
          problem={[1, 1, 0, 2]}
        />
      </ThemeProvider>);
  });
  const badgeTotals = component.toJSON();
  expect(badgeTotals).toMatchSnapshot();
});
