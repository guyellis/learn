const DoneIcon = require('material-ui/svg-icons/action/done').default;
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const Keyboard = require('./keyboard');
const PropTypes = require('prop-types');
const React = require('react');
const TextField = require('material-ui/TextField').default;
const helper = require('./helper');

const { operations } = helper;

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

const answerStyle = Object.assign(
  {},
  {
    height: '40px',
    width: '60px',
    paddingBottom: '5px',
    paddingLeft: '5px',
    display: 'inline-flex',
    outline: 'medium solid black',
    outlineOffset: '5px',
    fontSize: 'xx-large',
  });

class QuizLine extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
    this.keyPress = this.keyPress.bind(this);
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

  keyPress(key) {
    const { answer } = this.state;
    if (!isNaN(key)) {
      this.setState({
        answer: `${answer}${key}`,
      });
    } else {
      switch (key) {
        case 'back':
          if (answer.length) {
            this.setState({
              answer: answer.substr(0, answer.length - 1),
            });
          }
          break;
        case 'enter':
          this.checkAnswer();
          break;
        default:
          // eslint-disable-next-line no-console
          console.warn(`Unknown key in keyPress ${key}`);
          break;
      }
    }
  }

  render() {
    const { answer } = this.state;
    const { onscreenKeyboard, problem } = this.props;
    const [left, right, opIndex] = problem;
    const operator = operations[opIndex];
    return (
      <div>
        <div>
          <span style={numberStyle}>{left}</span>
          <span style={numberStyle}>{operator}</span>
          <span style={numberStyle}>{right}</span>
          <span style={numberStyle}>{'='}</span>
          {
            onscreenKeyboard
              ? <span style={answerStyle}>
                {answer || '?'}
              </span>
              : <TextField
                autoFocus
                hintText=""
                inputStyle={inputStyle}
                name="answer"
                onChange={this.onChange}
                onKeyPress={this.handleKeyPress}
                style={textStyle}
                type="number"
                value={answer}
              />
          }
          <FloatingActionButton
            onClick={this.checkAnswer}
            style={checkStyle}
            title="Check Answer"
          >
            <DoneIcon />
          </FloatingActionButton>
        </div>
        <div>
          <Keyboard
            keyPress={this.keyPress}
            onscreenKeyboard={onscreenKeyboard}
          />
        </div>
      </div>
    );
  }
}

QuizLine.propTypes = {
  checkAnswer: PropTypes.func.isRequired,
  onscreenKeyboard: PropTypes.bool.isRequired,
  problem: PropTypes.arrayOf(PropTypes.number).isRequired,
};

module.exports = QuizLine;
