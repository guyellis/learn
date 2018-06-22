const DoneIcon = require('material-ui/svg-icons/action/done').default;
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const PropTypes = require('prop-types');
const React = require('react');
const TextField = require('material-ui/TextField').default;
const Keyboard = require('./keyboard');
const constants = require('../../common/constants');
const RunningResults = require('./running-results');

const { OPERATIONS: operations } = constants;

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
    paddingLeft: '15px',
    paddingRight: '15px',
    fontSize: 'xx-large',
    backgroundColor: 'green',
    color: 'white',
  },
);

const lastResultCorrectStyle = {
  borderRadius: '5px',
  border: 'medium solid green',
  display: 'inline-block',
  paddingRight: '20px',
};

const lastResultIncorrectStyle = Object.assign({}, lastResultCorrectStyle, {
  border: 'medium solid red',
});

const quizLineStyle = {
  marginTop: '10px',
  marginBottom: '10px',
};

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
    const { checkAnswer } = this.props;
    const { answer } = this.state;
    checkAnswer(answer);
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

  renderNewRecord() {
    const {
      newRecord: {
        isNewRecord,
        currentTimePerQuestion,
        existingRecordTimePerQuestion,
      },
    } = this.props;

    const current = isNaN(currentTimePerQuestion) ? '[none]' : currentTimePerQuestion;
    const existing = existingRecordTimePerQuestion || '[none]';

    const recordText = `Current Speed ${current} and Record ${existing}${isNewRecord ? ' NEW RECORD!' : ''}`;

    return (
      <div>
        <div style={lastResultCorrectStyle}>
          {recordText}
        </div>
      </div>
    );
  }

  renderLastResult() {
    const { lastResult } = this.props;
    if (!lastResult) {
      const divStyle = Object.assign(
        {},
        lastResultCorrectStyle, {
          paddingBottom: '5px',
          paddingLeft: '10px',
          paddingRight: '10px',
          paddingTop: '5px',
          display: 'block',
        },
      );

      return (
        <div style={divStyle}>
          {'Ready for your first answer...'}
        </div>
      );
    }
    const { actuals, task } = lastResult;
    const [actual] = actuals;
    const [,,, answer] = task;

    const borderStyle = answer === actual
      ? lastResultCorrectStyle
      : lastResultIncorrectStyle;

    return (
      <div style={borderStyle}>
        <RunningResults previousResults={[lastResult]} />
      </div>
    );
  }

  render() {
    const { answer } = this.state;
    const { onscreenKeyboard, problem, largeKeyboard } = this.props;
    const [left, right, opIndex] = problem;
    const operator = operations[opIndex];
    return (
      <div>
        <div style={quizLineStyle}>
          <span style={numberStyle}>
            {left}
          </span>
          <span style={numberStyle}>
            {operator}
          </span>
          <span style={numberStyle}>
            {right}
          </span>
          <span style={numberStyle}>
=
          </span>
          {
            onscreenKeyboard
              ? (
                <span style={answerStyle}>
                  {answer || '?'}
                </span>
              )
              : (
                <TextField
                  autoFocus
                  hintText=""
                  id="answer-number"
                  inputStyle={inputStyle}
                  name="answer"
                  onChange={this.onChange}
                  onKeyPress={this.handleKeyPress}
                  style={textStyle}
                  type="number"
                  value={answer}
                />
              )
          }
          {
            !onscreenKeyboard
            && (
            <FloatingActionButton
              onClick={this.checkAnswer}
              style={checkStyle}
              title="Check Answer"
            >
              <DoneIcon />
            </FloatingActionButton>
            )
          }
        </div>
        {this.renderLastResult()}
        {this.renderNewRecord()}
        <div>
          <Keyboard
            keyPress={this.keyPress}
            onscreenKeyboard={onscreenKeyboard}
            largeKeyboard={largeKeyboard}
          />
        </div>
      </div>
    );
  }
}

QuizLine.propTypes = {
  checkAnswer: PropTypes.func.isRequired,
  lastResult: PropTypes.shape({
    actuals: PropTypes.arrayOf(PropTypes.number).isRequired,
    id: PropTypes.number.isRequired,
    task: PropTypes.array.isRequired, // left, right, opIndex, answer
    timeTaken: PropTypes.number.isRequired,
  }),
  newRecord: PropTypes.shape({
    isNewRecord: PropTypes.bool.isRequired,
    currentTimePerQuestion: PropTypes.number.isRequired,
    existingRecordTimePerQuestion: PropTypes.number.isRequired,
  }).isRequired,
  onscreenKeyboard: PropTypes.bool.isRequired,
  largeKeyboard: PropTypes.bool.isRequired,
  problem: PropTypes.arrayOf(PropTypes.number).isRequired,
};

QuizLine.defaultProps = {
  lastResult: null,
};

module.exports = QuizLine;
