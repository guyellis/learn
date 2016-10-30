const React = require('react');
const TextField = require('material-ui/TextField').default;
const DoneIcon = require('material-ui/svg-icons/action/done').default;
const FloatingActionButton = require('material-ui/FloatingActionButton').default;

class LearnMath extends React.Component {
  constructor(props) {
    super();
    this.state = {
      answer: '',
      lower: 0,
      sign: props.sign,
      upper: 5,
    };
    this.checkAnswer = this.checkAnswer.bind(this);
    this.reset = this.reset.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  getRandom() {
    return Math.round(Math.random() * this.state.upper);
  }

  componentWillMount() {
    this.reset();
  }

  reset() {
    let left = this.getRandom();
    let right = this.getRandom();
    if(this.state.sign === '-' && right > left) {
      [left, right] = [right, left];
    }
    this.setState({
      left,
      right
    })
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  checkAnswer() {
    const actual = parseInt(this.state.answer, 10);
    if(isNaN(actual)) {
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
    if(correct) {
      this.reset();
    }
  }

  handleKeyPress (event) {
    if(event.key === 'Enter') {
      this.checkAnswer();
    }
  }

  getTitle() {
    const title = ' the numbers';
    switch(this.props.sign) {
      case '+':
        return 'Add' + title;
      case '-':
        return 'Subtract' + title;
      case '/':
        return 'Divide' + title;
      case 'x':
        return 'Multiply' + title;
      default:
        return 'Uknown sign: ' + this.props.sign
    }
  }

  render() {
    const numberStyle = {
      fontSize: 'xx-large',
      margin: '10px'
    };
    const checkStyle = {
      margin: '10px'
    };
    const textStyle = {
      border: 'medium solid black',
      height: '80px',
      width: '80px',
      fontSize: 'xx-large'
    };
    const inputStyle = {
      textAlign: 'center',
    }
    const resultStyle = {
      fontSize: 'xx-large',
      color: this.state.correct ? 'darkgreen' : 'red'
    }
    return (
      <div>
        <div>
          <h1>{this.getTitle()}</h1>
          <span style={numberStyle}>{this.state.left}</span>
          <span style={numberStyle}>{this.props.sign}</span>
          <span style={numberStyle}>{this.state.right}</span>
          <span style={numberStyle}>{'='}</span>
          <TextField
            name='answer'
            hintText=''
            autoFocus={true}
            value={this.state.answer}
            type='number'
            style={textStyle}
            inputStyle={inputStyle}
            onChange={this.onChange}
            onKeyPress={this.handleKeyPress}
          />
          <FloatingActionButton
            onClick={this.checkAnswer}
            title='Check Answer'
            style={checkStyle}
          >
            <DoneIcon />
          </FloatingActionButton>
        </div>
        {!!this.state.result &&
          <div style={resultStyle}>{this.state.result}</div>
        }
        <div style={{marginTop: '50px'}}>
          {'Created for Sonali and Kai.'}
        </div>
      </div>
    )
  }
}

LearnMath.propTypes = {
  sign: React.PropTypes.string.isRequired,
};

module.exports = LearnMath;
