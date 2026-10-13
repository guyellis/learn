import PropTypes from 'prop-types';
import React from 'react';
import constants from '../../common/constants.js';
import QuizLine from './quiz-line.jsx';
import RunningResults from './running-results.jsx';

const { ALPHABET: alphabet, OPERATIONS: operations } = constants;

function running(props) {
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

  const spanStyle = {
    paddingLeft: 20,
  };

  const highlightStyle = {
    backgroundColor: 'lightblue',
    borderRadius: '3px',
    padding: '2px 5px',
  };

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

running.propTypes = {
  checkAnswer: PropTypes.func.isRequired,
  currentTask: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  largeKeyboard: PropTypes.bool.isRequired,
  levelIndex: PropTypes.number.isRequired,
  newRecord: PropTypes.shape({
    currentTimePerQuestion: PropTypes.number.isRequired,
    existingRecordTimePerQuestion: PropTypes.number.isRequired,
    isNewRecord: PropTypes.bool.isRequired,
  }).isRequired,
  onscreenKeyboard: PropTypes.bool.isRequired,
  opIndexes: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  previousResults: PropTypes.arrayOf(
    PropTypes.shape({
      actuals: PropTypes.arrayOf(PropTypes.number).isRequired,
      id: PropTypes.number.isRequired,
      task: PropTypes.array.isRequired, // left, right, opIndex, answer
      timeTaken: PropTypes.number.isRequired,
    }),
  ).isRequired,
  questionsRemaining: PropTypes.number.isRequired,
  timeLeft: PropTypes.number.isRequired,
};

running.defaultProps = {
  // currentRecord: null,
};

export default running;
