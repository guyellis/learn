
const React = require('react');
const PropTypes = require('prop-types');
const constants = require('../../common/constants');
const Badge = require('./badge');
const helper = require('./helper');

const { OPERATIONS } = constants;
const spanStyle = { paddingLeft: 20 };
const inABox = Object.assign({
  borderWidth: 1,
  borderStyle: 'solid',
  marginLeft: 20,
  padding: 3,
});
const check = '\u2714';
const xmark = '\u2717';
const lineStyle = { lineHeight: '35px' };
const correctStyle = Object.assign({ color: 'green' }, lineStyle);
const incorrectStyle = Object.assign({ color: 'red' }, lineStyle);
const spanStyleIncorrect = Object.assign({ color: 'red' }, spanStyle);

function runningResults(props) {
  const { previousResults, showIndex } = props;
  const previousResultRows = previousResults.map(({
    task, actuals, timeTaken, id,
  }) => {
    const [left, right, opIndex, answer] = task;
    const [actual] = actuals; // most recent answer is first in array
    const incorrects = actuals.slice(1).reverse();
    const operation = OPERATIONS[opIndex];
    const correct = answer === actual;
    const style = correct ? correctStyle : incorrectStyle;
    const colorIndex = helper.getBadgeColorIndex(timeTaken);
    return (
      <div key={id} style={style}>
        {
          showIndex
          && (
          <span style={spanStyle}>
            {`${id + 1})`}
          </span>
          )
        }
        <Badge color={colorIndex} content={operation} />
        <span style={spanStyle}>
          {left}
        </span>
        <span style={spanStyle}>
          {operation}
        </span>
        <span style={spanStyle}>
          {right}
        </span>
        <span style={spanStyle}>
=
        </span>
        <span style={inABox}>
          {actual}
        </span>
        <span style={spanStyle}>
          {correct ? check : xmark}
        </span>
        <span style={spanStyle}>
          {`${timeTaken} seconds`}
        </span>
        {
          !!incorrects.length
          && (
          <span style={spanStyleIncorrect}>
            {`Incorrect answer(s): ${incorrects.join()}`}
          </span>
          )
        }
      </div>);
  });
  return (
    <div>
      {previousResultRows}
    </div>
  );
}

runningResults.propTypes = {
  previousResults: PropTypes.arrayOf(PropTypes.shape({
    actuals: PropTypes.arrayOf(PropTypes.number).isRequired,
    id: PropTypes.number.isRequired,
    task: PropTypes.array.isRequired, // left, right, opIndex, answer
    timeTaken: PropTypes.number.isRequired,
  })).isRequired,
  showIndex: PropTypes.bool,
};

runningResults.defaultProps = {
  showIndex: false,
};

module.exports = runningResults;
