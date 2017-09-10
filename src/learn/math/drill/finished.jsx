const PropTypes = require('prop-types');
const React = require('react');
const RunningResults = require('./running-results');

function finished(props) {
  return (<div>
    <h1>{'Finished'}</h1>
    <div>
      {`Time left: ${props.timeLeft}`}
    </div>
    <div>
      {`Time Allowed: ${props.timeAllowed}`}
    </div>
    <div>
      {`Total Problems: ${props.totalProblems}`}
    </div>
    <h3>{'How you did'}</h3>
    <RunningResults
      previousResults={props.previousResults}
    />
  </div>);
}

finished.propTypes = {
  timeLeft: PropTypes.number.isRequired,
  timeAllowed: PropTypes.number.isRequired,
  totalProblems: PropTypes.number.isRequired,
  previousResults: PropTypes.arrayOf(PropTypes.shape({
    task: PropTypes.array.isRequired, // left, right, opIndex, answer
    actual: PropTypes.number.isRequired,
    timeTaken: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
  })).isRequired,
};

module.exports = finished;
