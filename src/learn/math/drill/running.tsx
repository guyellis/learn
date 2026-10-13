import React from 'react';
import constants from '../../common/constants.js';
import QuizLine from './quiz-line.js';
import RunningResults from './running-results.js';
import type { DrillTask, NewRecordComparison, PreviousResult } from './types.js';

const { ALPHABET: alphabet, OPERATIONS: operations } = constants;

const spanStyle: React.CSSProperties = {
  paddingLeft: 20,
};

const highlightStyle: React.CSSProperties = {
  backgroundColor: 'lightblue',
  borderRadius: '3px',
  padding: '2px 5px',
};

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
      <div>
        <span style={spanStyle}>
          {'Level: '}
          <span style={highlightStyle}>{alphabet[levelIndex]}</span>
        </span>
        <span style={spanStyle}>
          {'Operation(s): '}
          <span style={highlightStyle}>{opIndexes.map((i) => operations[i]).join()}</span>
        </span>
      </div>
      <div>
        <span style={spanStyle}>
          {'Time Left: '}
          <span style={highlightStyle}>{timeLeft}</span>
          {' seconds'}
        </span>
        <span style={spanStyle}>
          {'Questions Remaining: '}
          <span style={highlightStyle}>{questionsRemaining}</span>
        </span>
      </div>
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
