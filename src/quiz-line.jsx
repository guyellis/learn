
const React = require('react');
const PropTypes = require('prop-types');
const DoneIcon = require('material-ui/svg-icons/action/done').default;
const TextField = require('material-ui/TextField').default;
const FloatingActionButton = require('material-ui/FloatingActionButton').default;

const numberStyle = {
  fontSize: 'xx-large',
  margin: '10px',
};
const checkStyle = {
  margin: '10px',
};
const textStyle = {
  border: 'medium solid black',
  height: '80px',
  width: '80px',
  fontSize: 'xx-large',
};
const inputStyle = {
  textAlign: 'center',
};
function quizLine(props) {
  const operator = ['+', '-', 'x', '/'][props.operator];
  return (
    <div>
      <span style={numberStyle}>{props.left}</span>
      <span style={numberStyle}>{operator}</span>
      <span style={numberStyle}>{props.right}</span>
      <span style={numberStyle}>{'='}</span>
      <TextField
        name="answer"
        hintText=""
        value={props.answer}
        type="number"
        style={textStyle}
        inputStyle={inputStyle}
        onChange={props.onChange}
        onKeyPress={props.handleKeyPress}
      />
      <FloatingActionButton
        onClick={props.checkAnswer}
        title="Check Answer"
        style={checkStyle}
      >
        <DoneIcon />
      </FloatingActionButton>
    </div>
  );
}

quizLine.propTypes = {
  answer: PropTypes.number.isRequired,
  checkAnswer: PropTypes.func.isRequired,
  handleKeyPress: PropTypes.func.isRequired,
  left: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  operator: PropTypes.number.isRequired,
  right: PropTypes.number.isRequired,
};

module.exports = quizLine;
