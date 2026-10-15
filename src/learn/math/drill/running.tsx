import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import React, { useEffect, useRef, useState } from 'react';
import constants from '../../common/constants.js';
import QuizLine from './quiz-line.js';
import RunningResults from './running-results.js';
import type { DrillTask, NewRecordComparison, PreviousResult } from './types.js';

const { ALPHABET: alphabet, OPERATIONS: operations } = constants;

export interface RunningProps {
  checkAnswer: (answer: string) => void;
  currentTask?: DrillTask;
  levelIndex: number;
  newRecord: NewRecordComparison;
  opIndexes: number[];
  previousResults: PreviousResult[];
  questionsRemaining: number;
  timeLeft: number;
}

function Running(props: RunningProps) {
  const {
    checkAnswer,
    currentTask,
    levelIndex,
    newRecord,
    opIndexes,
    previousResults,
    questionsRemaining,
    timeLeft,
  } = props;

  const [isFlashing, setIsFlashing] = useState(false);
  const flashTimerRef = useRef<NodeJS.Timeout | number | null>(null);

  useEffect(() => {
    return () => {
      if (flashTimerRef.current) {
        clearTimeout(flashTimerRef.current as NodeJS.Timeout);
      }
    };
  }, []);

  if (!currentTask) {
    // eslint-disable-next-line no-console
    console.warn('No currentTask defined in renderRunning');
    return null;
  }

  const handleCheckAnswer = (answer: string) => {
    const actual = parseInt(answer, 10);
    const [, , , expected] = currentTask;
    if (actual === expected) {
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!prefersReducedMotion) {
        setIsFlashing(true);
        if (flashTimerRef.current) {
          clearTimeout(flashTimerRef.current as NodeJS.Timeout);
        }
        flashTimerRef.current = setTimeout(() => {
          setIsFlashing(false);
          flashTimerRef.current = null;
        }, 300);
      }
    }
    checkAnswer(answer);
  };

  const lastTen = previousResults.slice(Math.max(0, previousResults.length - 10)).reverse();
  const lastResult = lastTen[0];

  return (
    <Box
      data-flashing={isFlashing}
      data-testid="quiz-area-container"
      sx={{
        backgroundColor: isFlashing ? 'success.main' : 'transparent',
        borderRadius: 2,
        p: 2,
        transition: 'background-color 150ms ease',
      }}
    >
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Chip
          label={
            <span>
              <span>Level:</span>{' '}
              <Box component="span" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                {alphabet[levelIndex]}
              </Box>
            </span>
          }
          variant="outlined"
        />
        <Chip
          label={
            <span>
              <span>Operation(s):</span>{' '}
              <Box component="span" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
                {opIndexes.map((i) => operations[i]).join()}
              </Box>
            </span>
          }
          variant="outlined"
        />
        <Chip
          label={
            <span>
              <span>Time Left:</span>{' '}
              <Box component="span" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                {timeLeft}
              </Box>
              <span> seconds</span>
            </span>
          }
          variant="outlined"
        />
        <Chip
          label={
            <span>
              <span>Questions Remaining:</span>{' '}
              <Box component="span" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                {questionsRemaining}
              </Box>
            </span>
          }
          variant="outlined"
        />
      </Stack>
      <div>
        <QuizLine
          checkAnswer={handleCheckAnswer}
          lastResult={lastResult}
          newRecord={newRecord}
          problem={currentTask}
        />
        <RunningResults previousResults={lastTen} showIndex />
      </div>
    </Box>
  );
}

export default Running;
