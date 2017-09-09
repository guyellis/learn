
const React = require('react');
const PropTypes = require('prop-types');
const helper = require('./helper');

const { operations } = helper;
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

function runningResults(props) {
  const { running } = props;
  const lastThree = running.slice(Math.max(0, running.length - 3)).reverse();
  const previousResultRows = lastThree.map(({ task, actual, timeTaken, id }) => {
    const [left, right, opIndex, answer] = task;
    const correct = answer === actual;
    const style = correct ? correctStyle : incorrectStyle;
    return (<div key={id} style={style}>
      <span style={spanStyle}>{left}</span>
      <span style={spanStyle}>{operations[opIndex]}</span>
      <span style={spanStyle}>{right}</span>
      <span style={spanStyle}>{'='}</span>
      <span style={inABox}>{answer}</span>
      <span style={spanStyle}>{correct ? check : xmark}</span>
      <span style={spanStyle}>{`${timeTaken}s`}</span>
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
