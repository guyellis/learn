import PropTypes from 'prop-types';
import React from 'react';
import RunningResults from './running-results.jsx';
import constants from '../../common/constants.js';
import FinishedBadge from './finished-badge.jsx';
import ScoreBar from './score-bar.jsx';
import PreviousResults from './previous-results.js';
import Types from './types.js';
import helper from './helper.js';

const {
  RECORD_NEW,
  RECORD_EQUAL,
  RECORD_MISS,
  RECORD_NOT_EXIST,
} = constants;

const baseRecordStyle = {
  color: 'black',
  backgroundColor: '#8bc78b',
  padding: '20px',
  borderRadius: '5px',
  marginBottom: '10px',
};

const newRecordStyle = baseRecordStyle;

const missRecordStyle = { ...baseRecordStyle, backgroundColor: '#ecc9e0' };

const notExistRecordStyle = {
  ...baseRecordStyle,
  color: 'white',
  backgroundColor: '#8583dc',
};

function processResultInfo(resultInfo) {
  const { newRecordInfo, text } = resultInfo;
  let style;
  switch (newRecordInfo) {
    case RECORD_NEW:
    case RECORD_EQUAL:
      style = newRecordStyle;
      break;
    case RECORD_MISS:
      style = missRecordStyle;
      break;
    case RECORD_NOT_EXIST:
      style = notExistRecordStyle;
      break;
    default:
      return (
        <div>
          {`Unknown newRecordInfo ${newRecordInfo} in switch case`}
        </div>
      );
  }
  return (
    <div style={style}>
      {text}
    </div>
  );
}

function finished(props) {
  const { levelIndex: propsLevelIndex, opIndexes: propsOpIndexes } = props;
  const {
    levelIndex,
    opIndexes,
    previousResults,
    resultInfo,
    scoreBarTimes = helper.getScoreBarTimes(propsLevelIndex, propsOpIndexes),
    timeAllowed,
    timeLeft,
    totalProblems,
  } = props;

  const crunchedResults = PreviousResults.getStats(previousResults);

  const {
    incorrects,
    correctCount,
    longestTime: long,
    shortestTime: short,
    totalTime,
  } = crunchedResults;

  const longestTime = long ? [long] : [];
  const shortestTime = short ? [short] : [];
  const calculatedTimePerQuestion = parseFloat((totalTime / correctCount).toFixed(1));
  const timePerQuestion = (correctCount > 9 && scoreBarTimes && scoreBarTimes.length)
    ? scoreBarTimes[scoreBarTimes.length - 1].timePerQuestion
    : calculatedTimePerQuestion;

  const slowSort = PreviousResults.sortBySlowest(previousResults);

  if (!longestTime.length) {
    return (
      <div>
        <h1>
Finished
        </h1>
        <div>
          {'Looks like you didn\'t get a chance to do anything that round!'}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>
Finished
      </h1>
      {processResultInfo(resultInfo)}
      <FinishedBadge
        levelIndex={levelIndex}
        opIndexes={opIndexes}
        timePerQuestion={timePerQuestion}
        totalCorrectAnswers={correctCount}
      />
      <ScoreBar
        times={scoreBarTimes}
        showScoreBar={correctCount > 9}
      />
      <div>
        {`You had ${timeLeft} seconds left out of the ${timeAllowed} seconds allowed.`}
      </div>
      <div>
        {`You correctly answered ${correctCount} of the ${totalProblems} problems.`}
      </div>
      <h4>
The problem that took you the longest to answer
      </h4>
      <RunningResults previousResults={longestTime} />
      <h4>
The problem you answered the fastest
      </h4>
      <RunningResults previousResults={shortestTime} />
      {!!incorrects.length
        && (
        <div>
          <h4>
The ones that you got wrong
          </h4>
          <RunningResults previousResults={incorrects} />
        </div>
        )}
      <h4>
How you did (sorted by slowest)
      </h4>
      <RunningResults
        previousResults={slowSort}
      />
    </div>
  );
}

finished.propTypes = {
  levelIndex: PropTypes.number.isRequired,
  opIndexes: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  previousResults: PropTypes.arrayOf(Types.previousResults).isRequired,
  resultInfo: PropTypes.shape({
    text: PropTypes.string.isRequired,
    newRecordInfo: PropTypes.string.isRequired,
  }).isRequired,
  scoreBarTimes: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.number.isRequired,
    timePerQuestion: PropTypes.number.isRequired,
  })),
  timeAllowed: PropTypes.number.isRequired,
  timeLeft: PropTypes.number.isRequired,
  totalProblems: PropTypes.number.isRequired,
};

finished.defaultProps = {
  scoreBarTimes: undefined,
};

export default finished;
