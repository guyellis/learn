
const React = require('react');
const PropTypes = require('prop-types');
const helper = require('./helper');

const { operations } = helper;
const spanStyle = { paddingLeft: 20 };
const check = '\u2713';
const xmark = 'x';

function runningResults(props) {
  const { running } = props;
  const lastThree = running.slice(Math.max(0, running.length - 3)).reverse();
  const previousResultRows = lastThree.map(({ task, actual, timeTaken }) => {
    const [left, right, opIndex, answer] = task;
    const spans = [left, operations[opIndex], right, '=', answer,
      answer === actual ? check : xmark, `${timeTaken}s`];
    return (<div>
      {spans.map(span => <span style={spanStyle}>{span.toString()}</span>)}
    </div>);
  });
  return (
    <div>
      {previousResultRows}
    </div>
  );
}

runningResults.propTypes = {
  running: PropTypes.arrayOf(PropTypes.object).isRequired,
};

module.exports = runningResults;
