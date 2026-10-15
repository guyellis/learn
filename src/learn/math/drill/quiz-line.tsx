import { Close } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { alpha, keyframes } from '@mui/material/styles';
import React, { useEffect, useRef, useState } from 'react';
import constants from '../../common/constants.js';
import { generateAnswerChoices } from './answer-choices.js';
import RunningResults from './running-results.js';
import type { DrillTask, PreviousResult } from './types.js';

const { OPERATIONS: operations } = constants;

const glowFade = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

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
  problem: DrillTask;
}

function QuizLine(props: QuizLineProps) {
  const { checkAnswer, lastResult, problem } = props;
  const [problemKey, setProblemKey] = useState<string>(() => problem.join(','));
  const [choices, setChoices] = useState<number[]>(() => generateAnswerChoices(problem));
  const [disabledAnswers, setDisabledAnswers] = useState<number[]>([]);
  const [glowingIndex, setGlowingIndex] = useState<number | null>(null);
  const glowTimerRef = useRef<NodeJS.Timeout | number | null>(null);

  useEffect(() => {
    return () => {
      if (glowTimerRef.current) {
        clearTimeout(glowTimerRef.current as NodeJS.Timeout);
      }
    };
  }, []);

  const currentKey = problem.join(',');
  if (currentKey !== problemKey) {
    setProblemKey(currentKey);
    setChoices(generateAnswerChoices(problem));
    setDisabledAnswers([]);
  }

  const [left, right, opIndex, expected] = problem;
  const operator = operations[opIndex];

  const handleChoiceClick = (choice: number, index: number) => {
    if (choice !== expected) {
      setDisabledAnswers((prev) => [...prev, choice]);
    } else {
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!prefersReducedMotion) {
        if (glowTimerRef.current) {
          clearTimeout(glowTimerRef.current as NodeJS.Timeout);
        }
        setGlowingIndex(index);
        glowTimerRef.current = setTimeout(() => {
          setGlowingIndex(null);
          glowTimerRef.current = null;
        }, 300);
      }
    }
    checkAnswer(String(choice));
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
        {choices.map((choice, index) => {
          const isDisabled = disabledAnswers.includes(choice);
          const isGlowing = glowingIndex === index;
          return (
            <Button
              color="primary"
              data-glowing={isGlowing ? 'true' : 'false'}
              disabled={isDisabled}
              key={index}
              onClick={() => handleChoiceClick(choice, index)}
              sx={{
                borderRadius: 2,
                fontSize: '1.75rem',
                fontWeight: 'bold',
                minHeight: '64px',
                overflow: 'visible',
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
              {isGlowing && (
                <Box
                  aria-hidden="true"
                  data-testid="radial-glow"
                  sx={{
                    animation: `${glowFade} 300ms ease-out forwards`,
                    background: (theme) =>
                      `radial-gradient(ellipse at center, ${alpha(theme.palette.success.main, 0.7)} 0%, ${alpha(theme.palette.success.main, 0.3)} 60%, transparent 100%)`,
                    borderRadius: 3,
                    bottom: -6,
                    left: -6,
                    pointerEvents: 'none',
                    position: 'absolute',
                    right: -6,
                    top: -6,
                    zIndex: 1,
                  }}
                />
              )}
            </Button>
          );
        })}
      </Box>
      {renderLastResult()}
    </div>
  );
}

export default QuizLine;
