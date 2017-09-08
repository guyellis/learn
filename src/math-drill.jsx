const { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } = require('material-ui/Table');
const AVPlayArrow = require('material-ui/svg-icons/av/play-arrow').default;
const DoneIcon = require('material-ui/svg-icons/action/done').default;
const EditIcon = require('material-ui/svg-icons/editor/mode-edit').default;
const FlatButton = require('material-ui/FlatButton').default;
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const MenuItem = require('material-ui/MenuItem').default;
const moment = require('moment');
const React = require('react');
const ResetIcon = require('material-ui/svg-icons/av/replay').default;
const SaveIcon = require('material-ui/svg-icons/content/save').default;
const SelectField = require('material-ui/SelectField').default;
const TextField = require('material-ui/TextField').default;
const QuizLine = require('./quiz-line');

const numberStyle = {
  fontSize: 'xx-large',
  margin: '10px',
};

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const operations = ['+', '-', 'x', '/'];

function getScores() {
  let scores;
  try {
    scores = JSON.parse(localStorage.getItem('scores') || '[]');
  } catch (e) {
    scores = [];
  }
  return scores;
}

class MathDrill extends React.Component {
  constructor() {
    super();

    // TODO: opIndex, levelIndex to localStorage and restore at startup
    this.state = {
      opIndex: 0, // +
      levelIndex: 0, // A
      lower: 1,
      upper: 3,
    };

    this.checkAnswer = this.checkAnswer.bind(this);
    this.focus = this.focus.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onStart = this.onStart.bind(this);
    this.reset = this.reset.bind(this);
    this.runningTotal = this.runningTotal.bind(this);
    this.save = this.save.bind(this);
    this.setNextTask = this.setNextTask.bind(this);
    this.onInterval = this.onInterval.bind(this);
  }

  componentWillMount() {
    this.setNextTask();
  }

  componentDidMount() {
    this.focus();
  }

  onInterval() {
    const {
      endTime,
    } = this.state;
    const timeLeft = Math.round(endTime.diff(moment()) / 1000);
    const timeIsUp = timeLeft <= 0;
    if (timeIsUp) {
      clearInterval(this.state.timerId);
    }
    this.setState({
      timeLeft,
      timeIsUp,
    });
  }

  onStart() {
    this.setNextTask();
    const { minutes = '1' } = this.state;
    const seconds = parseFloat(minutes, 10) * 60;
    const endTime = moment().add(seconds, 'seconds');
    const timerId = setInterval(this.onInterval, 1000);
    this.setState({
      currentAction: 'running',
      endTime,
      timerId,
      seconds,
      timeLeft: seconds,
    });
  }

  onChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }

  getRandom() {
    const min = Math.ceil(this.state.lower);
    const max = Math.floor(this.state.upper);
    return Math.floor(Math.random() * ((max - min) + 1)) + min;
  }

  getTitle() {
    const title = ' the numbers';
    switch (this.props.sign) {
      case '+':
        return `Add${title}`;
      case '-':
        return `Subtract${title}`;
      case '/':
        return `Divide${title}`;
      case 'x':
        return `Multiply${title}`;
      default:
        return `Uknown sign: ${this.props.sign}`;
    }
  }

  setNextTask() {
    let left = this.getRandom();
    let right = this.getRandom();
    if (this.state.sign === '-' && right > left) {
      [left, right] = [right, left];
    }
    if (this.isSameProblem(left, right)) {
      this.setNextTask();
    } else {
      this.setState({
        currentTask: {
          left,
          right,
          operator: this.state.opIndex,
          answer: this.getExpected(left, right),
        },
      });
    }
  }

  getSign() {
    switch (this.state.operator) {
      case '/':
        return (<span style={numberStyle}>&divide;</span>);
      default:
        return (<span style={numberStyle}>{this.props.sign}</span>);
    }
  }

  getExpected(left, right) {
    switch (this.state.opIndex) {
      case 0:
        return left + right;
      case 1:
        return left - right;
      case 2:
        return left * right;
      case 3:
        return left / right;
      default:
        return 0;
    }
  }

  isSameProblem(left, right) {
    if (this.state.upper - this.state.lower < 3) {
      return false;
    }
    const newNumbers = [left, right].sort();
    const oldNumbers = [this.state.left, this.state.right].sort();
    return newNumbers[0] === oldNumbers[0] && newNumbers[1] === oldNumbers[1];
  }

  save() {
    const {
      startTime,
      correctCount,
      totalCount,
    } = this.state;
    if (totalCount) {
      const scores = getScores();
      const {
        lower,
        sign,
        upper,
      } = this.props;
      scores.unshift({
        correctCount,
        date: new Date().toISOString(),
        lower,
        sign,
        time: Math.round((Date.now() - startTime) / 1000),
        totalCount,
        upper,
      });
      if (scores.length > 10) {
        scores.pop();
      }
      localStorage.setItem('scores', JSON.stringify(scores));
      this.setState({ scores });
      this.reset();
    }
  }

  focus() {
    if (this.answerInput) {
      this.answerInput.focus();
    }
  }

  runningTotal() {
    const { correctCount, totalCount, startTime } = this.state;
    const seconds = Math.round((Date.now() - startTime) / 1000);
    return `${correctCount} / ${totalCount}  (${seconds}s)`;
  }

  reset() {
    this.setState({
      startTime: Date.now(),
      correctCount: 0,
      totalCount: 0,
    });
    this.focus();
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.checkAnswer();
    }
  }

  checkAnswer() {
    const actual = parseInt(this.state.answer, 10);
    if (!isNaN(actual)) {
      let { correctCount, totalCount } = this.state;
      totalCount += 1;
      const expected = this.getExpected();
      const correct = actual === expected;
      if (correct) {
        correctCount += 1;
      }
      const answer = '';
      this.setState({
        answer,
        correct,
        correctCount,
        result: `${actual} is ${correct ? 'correct' : 'wrong'}`,
        totalCount,
      });
      if (correct) {
        this.setNextTask();
      }
    }

    this.focus();
  }

  oldrender() {
    const { scores = [] } = this.state;
    const header = (
      <TableHeader displaySelectAll={false}>
        <TableRow>
          <TableHeaderColumn>Date</TableHeaderColumn>
          <TableHeaderColumn>Lower</TableHeaderColumn>
          <TableHeaderColumn>Upper</TableHeaderColumn>
          <TableHeaderColumn>Sign</TableHeaderColumn>
          <TableHeaderColumn>Time</TableHeaderColumn>
          <TableHeaderColumn>Correct</TableHeaderColumn>
          <TableHeaderColumn>Total</TableHeaderColumn>
        </TableRow>
      </TableHeader>
    );
    const rows = scores.map(score =>
      (<TableRow key={score.date}>
        <TableRowColumn>{score.date}</TableRowColumn>
        <TableRowColumn>{score.lower}</TableRowColumn>
        <TableRowColumn>{score.upper}</TableRowColumn>
        <TableRowColumn>{score.sign}</TableRowColumn>
        <TableRowColumn>{`${score.time}s`}</TableRowColumn>
        <TableRowColumn>{score.correctCount}</TableRowColumn>
        <TableRowColumn>{score.totalCount}</TableRowColumn>
      </TableRow>));
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
    const resultStyle = {
      fontSize: 'xx-large',
      color: this.state.correct ? 'darkgreen' : 'red',
    };
    const styles = {
      totals: {
        fontSize: 'xx-large',
        color: 'blue',
      },
    };
    return (
      <div>
        <div>
          <h1>{this.getTitle()}</h1>
          <span style={numberStyle}>{this.state.left}</span>
          {this.getSign()}
          <span style={numberStyle}>{this.state.right}</span>
          <span style={numberStyle}>{'='}</span>
          <TextField
            name="answer"
            hintText=""
            ref={(input) => { this.answerInput = input; }}
            value={this.state.answer}
            type="number"
            style={textStyle}
            inputStyle={inputStyle}
            onChange={this.onChange}
            onKeyPress={this.handleKeyPress}
          />
          <FloatingActionButton
            onClick={this.checkAnswer}
            title="Check Answer"
            style={checkStyle}
          >
            <DoneIcon />
          </FloatingActionButton>
        </div>
        {!!this.state.result &&
          <div style={resultStyle}>{this.state.result}</div>
        }
        {!!this.state.totalCount &&
          <div style={styles.totals}>{this.runningTotal()}</div>
        }
        <div style={{ marginTop: '50px' }}>
          {'Created for Sonali and Kai.'}
        </div>
        <div>
          <FloatingActionButton
            onClick={this.props.toggleSetup}
            title="Edit Settings"
            style={checkStyle}
          >
            <EditIcon />
          </FloatingActionButton>
          <FloatingActionButton
            onClick={this.reset}
            title="Reset"
            style={checkStyle}
          >
            <ResetIcon />
          </FloatingActionButton>
          <FloatingActionButton
            onClick={this.save}
            title="Save Results"
            style={checkStyle}
          >
            <SaveIcon />
          </FloatingActionButton>
        </div>
        <div>
          {!!scores.length &&
            <Table>
              {header}
              <TableBody displayRowCheckbox={false}>
                {rows}
              </TableBody>
            </Table>
          }
        </div>
      </div>
    );
  }

  renderOptions() {
    console.log('state:', this.state);
    const {
      level = 0,
      opIndex,
      errors = {},
      minutes = 1,
      currentAction,
    } = this.state || {};
    const divStyle = currentAction === 'running'
      ? {
        pointerEvents: 'none',
        opacity: 0.4,
      } : {};
    console.log('level:', level);
    return (<div style={divStyle}>
      <SelectField
        floatingLabelText="Level"
        value={level}
        onChange={(e, i, v) => this.setState({ level: v })}
        name="level"
        style={{ width: 100 }}
      >
        {
          alphabet.map((letter, index) =>
            <MenuItem key={letter} value={index} primaryText={letter} />)
        }
      </SelectField>
      <SelectField
        floatingLabelText="Operation"
        value={opIndex}
        onChange={(e, i, v) => this.setState({ opIndex: v })}
        name="operation"
        style={{ width: 100 }}
      >
        {
          operations.map((operation, index) =>
            <MenuItem key={operation} value={index} primaryText={operation} />)
        }
      </SelectField>
      <TextField
        errorText={errors.minutes}
        floatingLabelText="Time"
        hintText="Minutes"
        name="minutes"
        onChange={this.onChange}
        type="number"
        value={minutes}
        style={{ width: 100, paddingLeft: 20 }}
      />
      <FlatButton
        label="Start"
        labelPosition="before"
        primary
        onClick={this.onStart}
        icon={<AVPlayArrow />}
      />
    </div>);
  }

  renderRunning() {
    const {
      completed = [],
      currentAction,
      currentTask,
      errors = {},
      level = 0,
      minutes = 1,
      opIndex,
      timeLeft,
    } = this.state || {};

    if (!currentTask) {
      console.warn('No currentTask defined in renderRunning');
      return null;
    }

    const {
      answer,
      left,
      operator,
      right,
    } = currentTask;

    const spanStyle = {
      paddingLeft: 20,
    };
    return (
      <div>
        <div>
          <span style={spanStyle}>{`Level: ${alphabet[level]}`}</span>
          <span style={spanStyle}>{`Operation: ${operations[opIndex]}`}</span>
          <span style={spanStyle}>{`Time Left: ${timeLeft} seconds`}</span>
        </div>
        <div>
          <QuizLine
            answer={answer}
            checkAnswer={this.checkAnswer}
            handleKeyPress={this.handleKeyPress}
            left={left}
            onChange={this.onChange}
            operator={operator}
            right={right}
          />
        </div>
      </div>);
  }

  render() {
    const {
      currentAction = 'start',
    } = this.state || {};
    switch (currentAction) {
      case 'start':
        return this.renderOptions();
      case 'running':
        return this.renderRunning();
      default:
        throw new Error(`Unknown currentAction ${currentAction}`);
    }
  }
}

// MathDrill.propTypes = {
//   lower: React.PropTypes.number.isRequired,
//   sign: React.PropTypes.string.isRequired,
//   toggleSetup: React.PropTypes.func.isRequired,
//   upper: React.PropTypes.number.isRequired,
// };

module.exports = MathDrill;
