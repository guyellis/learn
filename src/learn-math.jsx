const React = require('react');
const TextField = require('material-ui/TextField').default;
const DoneIcon = require('material-ui/svg-icons/action/done').default;
const EditIcon = require('material-ui/svg-icons/editor/mode-edit').default;
const FloatingActionButton = require('material-ui/FloatingActionButton').default;

class LearnMath extends React.Component {
  constructor(props) {
    super();
    this.state = {
      answer: '',
      lower: props.lower,
      sign: props.sign,
      upper: props.upper,
    };
    this.checkAnswer = this.checkAnswer.bind(this);
    this.reset = this.reset.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentWillMount() {
    this.reset();
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

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.checkAnswer();
    }
  }

  reset() {
    let left = this.getRandom();
    let right = this.getRandom();
    if (this.state.sign === '-' && right > left) {
      [left, right] = [right, left];
    }
    this.setState({
      left,
      right,
    });
  }

  checkAnswer() {
    const actual = parseInt(this.state.answer, 10);
    if (isNaN(actual)) {
      return;
    }
    const expected = this.state.sign === '+'
      ? this.state.left + this.state.right
      : this.state.left - this.state.right;
    const correct = actual === expected;
    const answer = '';
    this.setState({
      result: `${actual} is ${correct ? 'correct' : 'wrong'}`,
      correct,
      answer,
    });
    if (correct) {
      this.reset();
    }
  }

  render() {
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
    const resultStyle = {
      fontSize: 'xx-large',
      color: this.state.correct ? 'darkgreen' : 'red',
    };
    return (
      <div>
        <div>
          <h1>{this.getTitle()}</h1>
          <span style={numberStyle}>{this.state.left}</span>
          <span style={numberStyle}>{this.props.sign}</span>
          <span style={numberStyle}>{this.state.right}</span>
          <span style={numberStyle}>{'='}</span>
          <TextField
            name="answer"
            hintText=""
            autoFocus
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
        <div style={{ marginTop: '50px' }}>
          {'Created for Sonali and Kai.'}
        </div>
        <FloatingActionButton
          onClick={this.props.toggleSetup}
          title="Edit Settings"
          style={checkStyle}
        >
          <EditIcon />
        </FloatingActionButton>
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
