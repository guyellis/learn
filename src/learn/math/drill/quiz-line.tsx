import { Close } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import constants from '../../common/constants.js';
import { generateAnswerChoices } from './answer-choices.js';
import RunningResults from './running-results.js';
import type { DrillTask, NewRecordComparison, PreviousResult } from './types.js';

const { OPERATIONS: operations } = constants;

const numberStyle: React.CSSProperties = {
  fontSize: 'xx-large',
  margin: '10px',
};

const lastResultCorrectStyle: React.CSSProperties = {
  border: 'medium solid green',
  borderRadius: '5px',
  display: 'inline-block',
  paddingRight: '20px',
};

const lastResultIncorrectStyle: React.CSSProperties = {
  ...lastResultCorrectStyle,
  border: 'medium solid red',
};

const quizLineStyle: React.CSSProperties = {
  marginBottom: '10px',
  marginTop: '10px',
};

export interface QuizLineProps {
  checkAnswer: (answer: string) => void;
  lastResult?: PreviousResult | null;
  newRecord: NewRecordComparison;
  problem: DrillTask;
}

function QuizLine(props: QuizLineProps) {
  const { checkAnswer, lastResult, newRecord, problem } = props;
  const [problemKey, setProblemKey] = useState<string>(() => problem.join(','));
  const [choices, setChoices] = useState<number[]>(() => generateAnswerChoices(problem));
  const [disabledAnswers, setDisabledAnswers] = useState<number[]>([]);

  const currentKey = problem.join(',');
  if (currentKey !== problemKey) {
    setProblemKey(currentKey);
    setChoices(generateAnswerChoices(problem));
    setDisabledAnswers([]);
  }

  const [left, right, opIndex, expected] = problem;
  const operator = operations[opIndex];

  const handleChoiceClick = (choice: number) => {
    if (choice !== expected) {
      setDisabledAnswers((prev) => [...prev, choice]);
    }
    checkAnswer(String(choice));
  };

  const renderNewRecord = () => {
    const { currentTimePerQuestion, existingRecordTimePerQuestion, isNewRecord } = newRecord;

    const current = isNaN(currentTimePerQuestion) ? '[none]' : currentTimePerQuestion;
    const existing = existingRecordTimePerQuestion || '[none]';

    const recordText = `Current Speed ${current} and Record ${existing}${isNewRecord ? ' NEW RECORD!' : ''}`;

    return (
      <div>
        <div style={lastResultCorrectStyle}>{recordText}</div>
      </div>
    );
  };

  const renderLastResult = () => {
    if (!lastResult) {
      const divStyle = {
        ...lastResultCorrectStyle,
        display: 'block',
        paddingBottom: '5px',
        paddingLeft: '10px',
        paddingRight: '10px',
        paddingTop: '5px',
      };

      return <div style={divStyle}>{'Ready for your first answer...'}</div>;
    }
    const { actuals, task } = lastResult;
    const [actual] = actuals;
    const [, , , answer] = task;

    const borderStyle = answer === actual ? lastResultCorrectStyle : lastResultIncorrectStyle;

    return (
      <div style={borderStyle}>
        <RunningResults previousResults={[lastResult]} />
      </div>
    );
  };

  return (
    <div>
      <div style={quizLineStyle}>
        <span style={numberStyle}>{left}</span>
        <span style={numberStyle}>{operator}</span>
        <span style={numberStyle}>{right}</span>
        <span style={numberStyle}>=</span>
      </div>
      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: 'repeat(3, 1fr)',
          maxWidth: 340,
          my: 2,
        }}
      >
        {choices.map((choice) => {
          const isDisabled = disabledAnswers.includes(choice);
          return (
            <Button
              color="primary"
              disabled={isDisabled}
              key={choice}
              onClick={() => handleChoiceClick(choice)}
              sx={{
                borderRadius: 2,
                fontSize: '1.75rem',
                fontWeight: 'bold',
                minHeight: '64px',
                position: 'relative',
                ...(isDisabled && {
                  '&.Mui-disabled': {
                    borderColor: 'error.main',
                    color: 'text.disabled',
                  },
                }),
              }}
              variant="outlined"
            >
              {choice}
              {isDisabled && (
                <Close
                  aria-label="incorrect"
                  sx={{
                    color: 'error.main',
                    fontSize: '2.5rem',
                    pointerEvents: 'none',
                    position: 'absolute',
                  }}
                />
              )}
            </Button>
          );
        })}
      </Box>
      {renderLastResult()}
      {renderNewRecord()}
    </div>
  );
}

export default QuizLine;
