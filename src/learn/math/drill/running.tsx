import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import React from 'react';
import constants from '../../common/constants.js';
import QuizLine from './quiz-line.js';
import RunningResults from './running-results.js';
import type { DrillTask, NewRecordComparison, PreviousResult } from './types.js';

const { ALPHABET: alphabet, OPERATIONS: operations } = constants;

export interface RunningProps {
  checkAnswer: (answer: string) => void;
  currentTask?: DrillTask;
  largeKeyboard: boolean;
  levelIndex: number;
  newRecord: NewRecordComparison;
  onscreenKeyboard: boolean;
  opIndexes: number[];
  previousResults: PreviousResult[];
  questionsRemaining: number;
  timeLeft: number;
}

function running(props: RunningProps) {
  const {
    checkAnswer,
    currentTask,
    largeKeyboard,
    levelIndex,
    newRecord,
    onscreenKeyboard,
    opIndexes,
    previousResults,
    questionsRemaining,
    timeLeft,
  } = props;

  if (!currentTask) {
    // eslint-disable-next-line no-console
    console.warn('No currentTask defined in renderRunning');
    return null;
  }

  const lastTen = previousResults.slice(Math.max(0, previousResults.length - 10)).reverse();
  const lastResult = lastTen[0];

  return (
    <div>
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
          checkAnswer={checkAnswer}
          largeKeyboard={largeKeyboard}
          lastResult={lastResult}
          newRecord={newRecord}
          onscreenKeyboard={onscreenKeyboard}
          problem={currentTask}
        />
        <RunningResults previousResults={lastTen} showIndex />
      </div>
    </div>
  );
}

export default running;
