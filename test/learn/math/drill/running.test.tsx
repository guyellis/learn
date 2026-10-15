import { createTheme, ThemeProvider } from '@mui/material/styles';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import Running, { type RunningProps } from '../../../../src/learn/math/drill/running.js';
import type {
  DrillTask,
  NewRecordComparison,
  PreviousResult,
} from '../../../../src/learn/math/drill/types.js';

const theme = createTheme();

describe('Running', () => {
  const currentTask: DrillTask = [2, 3, 0, 5];
  const newRecord: NewRecordComparison = {
    currentTimePerQuestion: 1.5,
    existingRecordTimePerQuestion: 2.0,
    isNewRecord: false,
  };
  const previousResults: PreviousResult[] = [
    {
      actuals: [3],
      id: 1,
      task: [1, 2, 0, 3],
      timeTaken: 1.2,
    },
  ];

  const defaultProps: RunningProps = {
    checkAnswer: vi.fn(),
    currentTask,
    levelIndex: 0,
    newRecord,
    opIndexes: [0],
    previousResults,
    questionsRemaining: 19,
    timeLeft: 58,
  };

  test('should render the Running component with highlighted params', () => {
    render(
      <ThemeProvider theme={theme}>
        <Running {...defaultProps} />
      </ThemeProvider>,
    );

    expect(screen.getByText('Level:')).toBeDefined();
    expect(screen.getByText('A')).toBeDefined();
    expect(screen.getByText('Operation(s):')).toBeDefined();
    expect(screen.getAllByText('+').length).toBeGreaterThan(0);
    expect(screen.getByText('58')).toBeDefined();
  });

  test('should render multiple operations highlighted', () => {
    render(
      <ThemeProvider theme={theme}>
        <Running {...defaultProps} levelIndex={1} opIndexes={[0, 1]} />
      </ThemeProvider>,
    );

    expect(screen.getByText('Level:')).toBeDefined();
    expect(screen.getByText('B')).toBeDefined();
    expect(screen.getByText('+,-')).toBeDefined();
  });

  test('should return null and warn when currentTask is not defined', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Running {...defaultProps} currentTask={undefined} />
      </ThemeProvider>,
    );

    expect(container.firstChild).toBeNull();
    expect(spy).toHaveBeenCalledWith('No currentTask defined in renderRunning');
    spy.mockRestore();
  });

  test('should trigger radial glow on correct answer tap and remove glow after 300ms', async () => {
    const checkAnswer = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <Running {...defaultProps} checkAnswer={checkAnswer} />
      </ThemeProvider>,
    );

    const container = screen.getByTestId('quiz-area-container');
    const buttons = screen.getAllByRole('button');
    const correctButton = buttons.find((btn) => btn.textContent === '5')!;
    const otherButtons = buttons.filter((btn) => btn !== correctButton);

    fireEvent.click(correctButton);
    expect(checkAnswer).toHaveBeenCalledWith('5');

    // Container does not flash or change color
    expect(container.getAttribute('data-flashing')).toBeNull();

    // The tapped cell shows the glow and other cells do not
    expect(correctButton.getAttribute('data-glowing')).toBe('true');
    expect(correctButton.querySelector('[data-testid="radial-glow"]')).not.toBeNull();
    for (const otherButton of otherButtons) {
      expect(otherButton.getAttribute('data-glowing')).toBe('false');
      expect(otherButton.querySelector('[data-testid="radial-glow"]')).toBeNull();
    }

    // Trigger another correct tap while still glowing to exercise clearTimeout
    fireEvent.click(correctButton);
    expect(correctButton.getAttribute('data-glowing')).toBe('true');

    // After 300ms, glow is gone
    await waitFor(
      () => {
        expect(correctButton.getAttribute('data-glowing')).toBe('false');
        expect(correctButton.querySelector('[data-testid="radial-glow"]')).toBeNull();
      },
      { timeout: 1000 },
    );
  });

  test('should not trigger glow on wrong answer tap', () => {
    const checkAnswer = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <Running {...defaultProps} checkAnswer={checkAnswer} />
      </ThemeProvider>,
    );

    const container = screen.getByTestId('quiz-area-container');
    const buttons = screen.getAllByRole('button');
    const wrongButton = buttons.find((btn) => btn.textContent !== '5')!;

    fireEvent.click(wrongButton);
    expect(checkAnswer).toHaveBeenCalledWith(wrongButton.textContent);
    expect(wrongButton.getAttribute('data-glowing')).toBe('false');
    expect(container.getAttribute('data-flashing')).toBeNull();
    expect(screen.queryByTestId('radial-glow')).toBeNull();
  });

  test('should skip glow when user prefers reduced motion', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
    }));

    const checkAnswer = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <Running {...defaultProps} checkAnswer={checkAnswer} />
      </ThemeProvider>,
    );

    const buttons = screen.getAllByRole('button');
    const correctButton = buttons.find((btn) => btn.textContent === '5')!;

    fireEvent.click(correctButton);
    expect(checkAnswer).toHaveBeenCalledWith('5');

    // Should NOT glow because prefers-reduced-motion is true
    expect(correctButton.getAttribute('data-glowing')).toBe('false');
    expect(screen.queryByTestId('radial-glow')).toBeNull();

    window.matchMedia = originalMatchMedia;
  });

  test('should clear timer on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');

    const { unmount } = render(
      <ThemeProvider theme={theme}>
        <Running {...defaultProps} />
      </ThemeProvider>,
    );

    const buttons = screen.getAllByRole('button');
    const correctButton = buttons.find((btn) => btn.textContent === '5')!;
    fireEvent.click(correctButton);

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  test('should render timer badge with correct colors at boundary values (2 gold, 3 silver, 4 bronze, 5 blue)', () => {
    const cases = [
      {
        expectedAria: 'Current question time 2 seconds',
        expectedColor: ['#ffd700', 'rgb(255, 215, 0)'],
        expectedLabel: '2s',
        secondsAgo: 2,
      },
      {
        expectedAria: 'Current question time 3 seconds',
        expectedColor: ['#c0c0c0', 'rgb(192, 192, 192)'],
        expectedLabel: '3s',
        secondsAgo: 3,
      },
      {
        expectedAria: 'Current question time 4 seconds',
        expectedColor: ['#8c7853', '#8C7853', 'rgb(140, 120, 83)'],
        expectedLabel: '4s',
        secondsAgo: 4,
      },
      {
        expectedAria: 'Current question time 5 seconds',
        expectedColor: ['lightblue', 'rgb(173, 216, 230)'],
        expectedLabel: '5s',
        secondsAgo: 5,
      },
    ];

    for (const { expectedAria, expectedColor, expectedLabel, secondsAgo } of cases) {
      const questionStartTime = Temporal.Now.instant().subtract(
        Temporal.Duration.from({ seconds: secondsAgo }),
      );
      const { unmount } = render(
        <ThemeProvider theme={theme}>
          <Running {...defaultProps} questionStartTime={questionStartTime} />
        </ThemeProvider>,
      );

      const chip = screen.getByLabelText(expectedAria);
      expect(chip).toBeDefined();
      expect(chip.textContent).toBe(expectedLabel);
      expect(expectedColor).toContain(chip.style.backgroundColor);
      unmount();
    }
  });

  test('should hide pace chip before the first correct answer (pace is NaN)', () => {
    render(
      <ThemeProvider theme={theme}>
        <Running
          {...defaultProps}
          newRecord={{
            currentTimePerQuestion: NaN,
            existingRecordTimePerQuestion: NaN,
            isNewRecord: false,
          }}
        />
      </ThemeProvider>,
    );

    expect(screen.queryByText(/Speed/)).toBeNull();
  });

  test('should render outlined pace chip with and without an existing record when not a new record', () => {
    const { rerender } = render(
      <ThemeProvider theme={theme}>
        <Running
          {...defaultProps}
          newRecord={{
            currentTimePerQuestion: 2.5,
            existingRecordTimePerQuestion: NaN,
            isNewRecord: false,
          }}
        />
      </ThemeProvider>,
    );

    const withoutRecordChip = screen.getByText('Speed 2.5s').closest('.MuiChip-root')!;
    expect(withoutRecordChip).toBeDefined();
    expect(withoutRecordChip.className).toContain('MuiChip-outlined');
    expect(withoutRecordChip.className).not.toContain('MuiChip-colorSuccess');

    rerender(
      <ThemeProvider theme={theme}>
        <Running
          {...defaultProps}
          newRecord={{
            currentTimePerQuestion: 2.5,
            existingRecordTimePerQuestion: 2.0,
            isNewRecord: false,
          }}
        />
      </ThemeProvider>,
    );

    const withRecordChip = screen.getByText('Speed 2.5s · Record 2s').closest('.MuiChip-root')!;
    expect(withRecordChip).toBeDefined();
    expect(withRecordChip.className).toContain('MuiChip-outlined');
    expect(withRecordChip.className).not.toContain('MuiChip-colorSuccess');
  });

  test('should render filled success pace chip with NEW RECORD! when isNewRecord is true', () => {
    render(
      <ThemeProvider theme={theme}>
        <Running
          {...defaultProps}
          newRecord={{
            currentTimePerQuestion: 1.5,
            existingRecordTimePerQuestion: 2.0,
            isNewRecord: true,
          }}
        />
      </ThemeProvider>,
    );

    const newRecordChip = screen
      .getByText('Speed 1.5s · Record 2s · NEW RECORD!')
      .closest('.MuiChip-root')!;
    expect(newRecordChip).toBeDefined();
    expect(newRecordChip.className).toContain('MuiChip-filled');
    expect(newRecordChip.className).toContain('MuiChip-colorSuccess');
  });
});
