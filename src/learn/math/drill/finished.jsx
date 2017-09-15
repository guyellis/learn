const PropTypes = require('prop-types');
const React = require('react');
const RunningResults = require('./running-results');

function finished(props) {
  const {
    previousResults,
    timeAllowed,
    timeLeft,
    totalProblems,
  } = props;

  const crunchedResults = previousResults.reduce((acc, problem) => {
    const { task, actual, timeTaken } = problem;
    const [,,, answer] = task;

    const {
      incorrects,
    } = acc;
    let {
      correctCount,
      longestTime,
      shortestTime,
    } = acc;

    if (!longestTime) {
      longestTime = problem;
    } else {
      const { timeTaken: currentLongTime } = longestTime;

      if (currentLongTime < timeTaken) {
        longestTime = problem;
      }
    }

    if (!shortestTime) {
      shortestTime = problem;
    } else {
      const { timeTaken: currentShortTime } = shortestTime;

      if (currentShortTime > timeTaken) {
        shortestTime = problem;
      }
    }

    if (answer === actual) {
      correctCount += 1;
    } else {
      incorrects.push(problem);
    }

    return {
      correctCount,
      incorrects,
      longestTime,
      shortestTime,
    };
  }, { correctCount: 0, incorrects: [] });

  const {
    incorrects,
    correctCount,
    longestTime: long,
    shortestTime: short,
  } = crunchedResults;

  const longestTime = long ? [long] : [];
  const shortestTime = short ? [short] : [];

  const slowSort = previousResults.sort((a, b) => b.timeTaken - a.timeTaken);

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

  return (<div>
    <h1>{'Finished'}</h1>
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
  previousResults: PropTypes.arrayOf(PropTypes.shape({
    task: PropTypes.array.isRequired, // left, right, opIndex, answer
    actual: PropTypes.number.isRequired,
    timeTaken: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
  })).isRequired,
  timeAllowed: PropTypes.number.isRequired,
  timeLeft: PropTypes.number.isRequired,
  totalProblems: PropTypes.number.isRequired,
};

module.exports = finished;
