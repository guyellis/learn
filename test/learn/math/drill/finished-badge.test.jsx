import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import FinishedBadge from '../../../../src/learn/math/drill/finished-badge.jsx';

const theme = createTheme();

describe('Finished Badge', () => {
  test('should be rendered on happy path', () => {
    let component;
    act(() => {
      component = renderer.create(
        <ThemeProvider theme={theme}>
          <FinishedBadge
            levelIndex={0}
            opIndexes={[0]}
            timePerQuestion={2.2}
            totalCorrectAnswers={10}
          />
        </ThemeProvider>,
      );
    });
    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });

  test('should be rendered if multiple opIndexes', () => {
    let component;
    act(() => {
      component = renderer.create(
        <ThemeProvider theme={theme}>
          <FinishedBadge
            levelIndex={0}
            opIndexes={[0, 1]}
            timePerQuestion={2.2}
            totalCorrectAnswers={10}
          />
        </ThemeProvider>,
      );
    });
    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });

  test('should not be rendered if correct answers under 10', () => {
    let component;
    act(() => {
      component = renderer.create(
        <ThemeProvider theme={theme}>
          <FinishedBadge
            levelIndex={0}
            opIndexes={[0]}
            timePerQuestion={2.2}
            totalCorrectAnswers={9}
          />
        </ThemeProvider>,
      );
    });
    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });
});
