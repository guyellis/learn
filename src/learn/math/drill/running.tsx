import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import React from 'react';
import constants from '../../common/constants.js';
import helper from './helper.js';
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
  questionStartTime?: Temporal.Instant;
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
    questionStartTime,
    timeLeft,
  } = props;

  if (!currentTask) {
    // eslint-disable-next-line no-console
    console.warn('No currentTask defined in renderRunning');
    return null;
  }

  const questionStartInstant = questionStartTime ? helper.toInstant(questionStartTime) : null;
  const elapsedSeconds = questionStartInstant
    ? Math.max(
        0,
        Math.floor(Temporal.Now.instant().since(questionStartInstant).total({ unit: 'second' })),
      )
    : 0;
  const timerBadgeColor = helper.getBadgeHtmlColor(elapsedSeconds);

  const renderPaceChip = () => {
    const { currentTimePerQuestion, existingRecordTimePerQuestion, isNewRecord } = newRecord;
    if (isNaN(currentTimePerQuestion)) {
      return null;
    }

    const hasRecord = !isNaN(existingRecordTimePerQuestion);
    const baseText = hasRecord
      ? `Speed ${currentTimePerQuestion}s · Record ${existingRecordTimePerQuestion}s`
      : `Speed ${currentTimePerQuestion}s`;
    const label = `${baseText}${isNewRecord ? ' · NEW RECORD!' : ''}`;

    return (
      <Chip
        color={isNewRecord ? 'success' : undefined}
        label={label}
        variant={isNewRecord ? 'filled' : 'outlined'}
      />
    );
  };

  const lastTen = previousResults.slice(Math.max(0, previousResults.length - 10)).reverse();
  const lastResult = lastTen[0];

  return (
    <Box
      data-testid="quiz-area-container"
      sx={{
        backgroundColor: 'transparent',
        borderRadius: 2,
        p: 2,
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
        <Chip
          aria-label={`Current question time ${elapsedSeconds} seconds`}
          label={`${elapsedSeconds}s`}
          style={{ backgroundColor: timerBadgeColor }}
          sx={{
            backgroundColor: timerBadgeColor,
            color: 'common.black',
            fontWeight: 'bold',
          }}
        />
        {renderPaceChip()}
      </Stack>
      <div>
        <QuizLine checkAnswer={checkAnswer} lastResult={lastResult} problem={currentTask} />
        <RunningResults previousResults={lastTen} showIndex />
      </div>
    </Box>
  );
}

export default Running;
