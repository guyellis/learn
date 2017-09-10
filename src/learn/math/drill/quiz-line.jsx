
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

class QuizLine extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
    this.state = { answer: '' };
  }

  onChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }

  checkAnswer() {
    this.props.checkAnswer(this.state.answer);
    this.setState({
      answer: '',
    });
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.checkAnswer();
    }
  }
  render() {
    const [left, right, opIndex] = this.props.problem;
    const operator = ['+', '-', 'x', '/'][opIndex];
    return (
      <div>
        <span style={numberStyle}>{left}</span>
        <span style={numberStyle}>{operator}</span>
        <span style={numberStyle}>{right}</span>
        <span style={numberStyle}>{'='}</span>
        <TextField
          autoFocus
          hintText=""
          inputStyle={inputStyle}
          name="answer"
          onChange={this.onChange}
          onKeyPress={this.handleKeyPress}
          style={textStyle}
          type="number"
          value={this.state.answer}
        />
        <FloatingActionButton
          onClick={this.checkAnswer}
          title="Check Answer"
          style={checkStyle}
        >
          <DoneIcon />
        </FloatingActionButton>
      </div>
    );
  }
}

QuizLine.propTypes = {
  checkAnswer: PropTypes.func.isRequired,
  problem: PropTypes.arrayOf(PropTypes.number).isRequired,
};

module.exports = QuizLine;
