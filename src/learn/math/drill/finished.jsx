const PropTypes = require('prop-types');
const React = require('react');
const RunningResults = require('./running-results');
const constants = require('../../common/constants');
const FinishedBadge = require('./finished-badge');
const ScoreBar = require('./score-bar');
const PreviousResults = require('./previous-results');
const Types = require('./types');
const helper = require('./helper');

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

const missRecordStyle = Object.assign({}, baseRecordStyle, {
  backgroundColor: '#ecc9e0',
});

const notExistRecordStyle = Object.assign({}, baseRecordStyle, {
  color: 'white',
  backgroundColor: '#8583dc',
});

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
      return (<div>{`Unknown newRecordInfo ${newRecordInfo} in switch case`}</div>);
  }
  return (<div style={style}>{text}</div>);
}

function finished(props) {
  const {
    levelIndex,
    opIndexes,
    previousResults,
    resultInfo,
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
  const timePerQuestion = parseFloat((totalTime / correctCount).toFixed(1));

  const slowSort = PreviousResults.sortBySlowest(previousResults);

  if (!longestTime.length) {
    return (
      <div>
        <h1>{'Finished'}</h1>
        <div>
          {'Looks like you didn\'t get a chance to do anything that round!'}
        </div>
      </div>
    );
  }

  const scoreBarTimes = helper.getScoreBarTimes(levelIndex, opIndexes);

  return (<div>
    <h1>{'Finished'}</h1>
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
    <h4>{'The problem that took you the longest to answer'}</h4>
    <RunningResults previousResults={longestTime} />
    <h4>{'The problem you answered the fastest'}</h4>
    <RunningResults previousResults={shortestTime} />
    {!!incorrects.length &&
      <div>
        <h4>{'The ones that you got wrong'}</h4>
        <RunningResults previousResults={incorrects} />
      </div>
    }
    <h4>{'How you did (sorted by slowest)'}</h4>
    <RunningResults
      previousResults={slowSort}
    />
  </div>);
}

finished.propTypes = {
  levelIndex: PropTypes.number.isRequired,
  opIndexes: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  previousResults: PropTypes.arrayOf(Types.previousResults).isRequired,
  resultInfo: PropTypes.shape({
    text: PropTypes.string.isRequired,
    newRecordInfo: PropTypes.string.isRequired,
  }).isRequired,
  timeAllowed: PropTypes.number.isRequired,
  timeLeft: PropTypes.number.isRequired,
  totalProblems: PropTypes.number.isRequired,
};

module.exports = finished;
