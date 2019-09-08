const Fab = require('@material-ui/core/Fab').default;
const PropTypes = require('prop-types');
const React = require('react');
const TextField = require('@material-ui/core/TextField').default;
const { Done } = require('@material-ui/icons');
const Tooltip = require('@material-ui/core/Tooltip').default;
const Grid = require('@material-ui/core/Grid').default;
const Typography = require('@material-ui/core/Typography').default;
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

const inputStyle = {
  textAlign: 'center',
};

const extendedIcon = {
  marginRight: '10',
};

const answerStyle = {

  paddingLeft: '15px',
  paddingRight: '15px',
  fontSize: 'xx-large',
  backgroundColor: 'green',
  color: 'white',
};

const lastResultCorrectStyle = {
  borderRadius: '5px',
  border: 'medium solid green',
  display: 'inline-block',
  paddingRight: '20px',
};

const lastResultIncorrectStyle = { ...lastResultCorrectStyle, border: 'medium solid red' };


class QuizLine extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
    this.keyPress = this.keyPress.bind(this);
    // TODO: Fix and remove this ESLint disable
    // eslint-disable-next-line react/state-in-constructor
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
      return (
        <Grid container justify="flex-start" alignItems="center">
          <Typography variant="h5">
          Ready for your first answer!
          </Typography>
        </Grid>
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
        <Grid container justify="flex-start" alignItems="center">
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
                  id="answer-number"
                  style={inputStyle}
                  name="answer"
                  onChange={this.onChange}
                  onKeyPress={this.handleKeyPress}
                  type="number"
                  value={answer}
                />
              )
          }
          {
            !onscreenKeyboard
            && (
              <Tooltip title="Check Answer">
                <Fab variant="extended" onClick={this.checkAnswer} style={checkStyle}>
                  <Done style={extendedIcon} />
Check
                </Fab>
              </Tooltip>
            )
          }
        </Grid>
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
