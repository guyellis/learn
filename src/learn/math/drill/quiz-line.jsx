const DoneIcon = require('material-ui/svg-icons/action/done').default;
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const Keyboard = require('./keyboard');
const PropTypes = require('prop-types');
const React = require('react');
const TextField = require('material-ui/TextField').default;
const helper = require('./helper');
const RunningResults = require('./running-results');

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
    paddingLeft: '15px',
    paddingRight: '15px',
    fontSize: 'xx-large',
    backgroundColor: 'green',
    color: 'white',
  });

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

  renderNewRecord() {
    const {
      isNewRecord,
      currentTimePerQuestion,
      existingRecordTimePerQuestion,
    } = this.props.newRecord;

    const current = isNaN(currentTimePerQuestion) ? '?' : currentTimePerQuestion;

    const recordText =
`Current speed ${current}. Record ${existingRecordTimePerQuestion}\
${isNewRecord ? ' NEW RECORD!' : ''}`;

    return (
      <div style={lastResultCorrectStyle}>
        {recordText}
      </div>
    );
  }

  renderLastResult() {
    const { lastResult } = this.props;
    if (!lastResult) {
      const divStyle = Object.assign({},
        lastResultCorrectStyle, {
          paddingBottom: '5px',
          paddingLeft: '10px',
          paddingRight: '10px',
          paddingTop: '5px',
          display: 'block',
        });

      return (
        <div style={divStyle}>
          {'Ready for your first answer...'}
        </div>
      );
    }
    const { actual, task } = lastResult;
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
    const { onscreenKeyboard, problem } = this.props;
    const [left, right, opIndex] = problem;
    const operator = operations[opIndex];
    return (
      <div>
        <div style={quizLineStyle}>
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
          {
            !onscreenKeyboard &&
            <FloatingActionButton
              onClick={this.checkAnswer}
              style={checkStyle}
              title="Check Answer"
            >
              <DoneIcon />
            </FloatingActionButton>
          }
        </div>
        {this.renderLastResult()}
        {this.renderNewRecord()}
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
  lastResult: PropTypes.shape({
    actual: PropTypes.number.isRequired,
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
  problem: PropTypes.arrayOf(PropTypes.number).isRequired,
};

QuizLine.defaultProps = {
  lastResult: null,
};

module.exports = QuizLine;
