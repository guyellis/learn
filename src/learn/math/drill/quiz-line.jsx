import { Done } from '@mui/icons-material';
import FloatingActionButton from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import React from 'react';
import constants from '../../common/constants.js';
import Keyboard from './keyboard.jsx';
import RunningResults from './running-results.jsx';

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

const answerStyle = {
  backgroundColor: 'green',
  color: 'white',
  fontSize: 'xx-large',
  paddingLeft: '15px',
  paddingRight: '15px',
};

const lastResultCorrectStyle = {
  border: 'medium solid green',
  borderRadius: '5px',
  display: 'inline-block',
  paddingRight: '20px',
};

const lastResultIncorrectStyle = { ...lastResultCorrectStyle, border: 'medium solid red' };

const quizLineStyle = {
  marginBottom: '10px',
  marginTop: '10px',
};

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
      newRecord: { currentTimePerQuestion, existingRecordTimePerQuestion, isNewRecord },
    } = this.props;

    const current = isNaN(currentTimePerQuestion) ? '[none]' : currentTimePerQuestion;
    const existing = existingRecordTimePerQuestion || '[none]';

    const recordText = `Current Speed ${current} and Record ${existing}${isNewRecord ? ' NEW RECORD!' : ''}`;

    return (
      <div>
        <div style={lastResultCorrectStyle}>{recordText}</div>
      </div>
    );
  }

  renderLastResult() {
    const { lastResult } = this.props;
    if (!lastResult) {
      const divStyle = {
        ...lastResultCorrectStyle,
        display: 'block',
        paddingBottom: '5px',
        paddingLeft: '10px',
        paddingRight: '10px',
        paddingTop: '5px',
      };

      return <div style={divStyle}>{'Ready for your first answer...'}</div>;
    }
    const { actuals, task } = lastResult;
    const [actual] = actuals;
    const [, , , answer] = task;

    const borderStyle = answer === actual ? lastResultCorrectStyle : lastResultIncorrectStyle;

    return (
      <div style={borderStyle}>
        <RunningResults previousResults={[lastResult]} />
      </div>
    );
  }

  render() {
    const { answer } = this.state;
    const { largeKeyboard, onscreenKeyboard, problem } = this.props;
    const [left, right, opIndex] = problem;
    const operator = operations[opIndex];
    return (
      <div>
        <div style={quizLineStyle}>
          <span style={numberStyle}>{left}</span>
          <span style={numberStyle}>{operator}</span>
          <span style={numberStyle}>{right}</span>
          <span style={numberStyle}>=</span>
          {onscreenKeyboard ? (
            <span style={answerStyle}>{answer || '?'}</span>
          ) : (
            <TextField
              autoFocus
              id="answer-number"
              name="answer"
              onChange={this.onChange}
              onKeyPress={this.handleKeyPress}
              style={inputStyle}
              type="number"
              value={answer}
            />
          )}
          {!onscreenKeyboard && (
            <FloatingActionButton onClick={this.checkAnswer} style={checkStyle}>
              <Done />
              Check Answer
            </FloatingActionButton>
          )}
        </div>
        {this.renderLastResult()}
        {this.renderNewRecord()}
        <div>
          <Keyboard
            keyPress={this.keyPress}
            largeKeyboard={largeKeyboard}
            onscreenKeyboard={onscreenKeyboard}
          />
        </div>
      </div>
    );
  }
}

QuizLine.propTypes = {
  checkAnswer: PropTypes.func.isRequired,
  largeKeyboard: PropTypes.bool.isRequired,
  lastResult: PropTypes.shape({
    actuals: PropTypes.arrayOf(PropTypes.number).isRequired,
    id: PropTypes.number.isRequired,
    task: PropTypes.array.isRequired, // left, right, opIndex, answer
    timeTaken: PropTypes.number.isRequired,
  }),
  newRecord: PropTypes.shape({
    currentTimePerQuestion: PropTypes.number.isRequired,
    existingRecordTimePerQuestion: PropTypes.number.isRequired,
    isNewRecord: PropTypes.bool.isRequired,
  }).isRequired,
  onscreenKeyboard: PropTypes.bool.isRequired,
  problem: PropTypes.arrayOf(PropTypes.number).isRequired,
};

QuizLine.defaultProps = {
  lastResult: null,
};

export default QuizLine;
