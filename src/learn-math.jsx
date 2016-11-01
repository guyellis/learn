const DoneIcon = require('material-ui/svg-icons/action/done').default;
const EditIcon = require('material-ui/svg-icons/editor/mode-edit').default;
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const React = require('react');
const ResetIcon = require('material-ui/svg-icons/av/replay').default;
const SaveIcon = require('material-ui/svg-icons/content/save').default;
const TextField = require('material-ui/TextField').default;
const { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } = require('material-ui/Table');

const numberStyle = {
  fontSize: 'xx-large',
  margin: '10px',
};

function getScores() {
  let scores;
  try {
    scores = JSON.parse(localStorage.getItem('scores') || '[]');
  } catch (e) {
    scores = [];
  }
  return scores;
}

class LearnMath extends React.Component {
  constructor(props) {
    super();

    this.state = {
      answer: '',
      correctCount: 0,
      lower: props.lower,
      sign: props.sign,
      startTime: Date.now(),
      totalCount: 0,
      upper: props.upper,
      scores: getScores(),
    };

    this.checkAnswer = this.checkAnswer.bind(this);
    this.focus = this.focus.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.onChange = this.onChange.bind(this);
    this.reset = this.reset.bind(this);
    this.runningTotal = this.runningTotal.bind(this);
    this.save = this.save.bind(this);
    this.setNextTask = this.setNextTask.bind(this);
  }

  componentWillMount() {
    this.setNextTask();
  }

  componentDidMount() {
    this.focus();
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
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
        left,
        right,
      });
    }
  }

  getSign() {
    switch (this.props.sign) {
      case '/':
        return (<span style={numberStyle}>&divide;</span>);
      default:
        return (<span style={numberStyle}>{this.props.sign}</span>);
    }
  }

  getExpected() {
    const { left, right } = this.state;
    switch (this.state.sign) {
      case '+':
        return left + right;
      case '-':
        return left - right;
      case '*':
        return left * right;
      case '/':
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

/*
  <Table>
    <TableBody>
      <TableRow>
        <TableRowColumn>1</TableRowColumn>
        <TableRowColumn>John Smith</TableRowColumn>
        <TableRowColumn>Employed</TableRowColumn>
      </TableRow>
*/

  render() {
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
      </TableRow>)
    );
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
}

LearnMath.propTypes = {
  lower: React.PropTypes.number.isRequired,
  sign: React.PropTypes.string.isRequired,
  toggleSetup: React.PropTypes.func.isRequired,
  upper: React.PropTypes.number.isRequired,
};

module.exports = LearnMath;
