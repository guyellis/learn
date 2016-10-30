require('bootstrap/dist/css/bootstrap.min.css');
const React = require('react');
const LearnMath = require('./learn-math');
const LearnSetup = require('./setup');

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      lower: 0,
      setup: true,
      sign: '+',
      upper: 10,
    };
    this.onChange = this.onChange.bind(this);
    this.toggleSetup = this.toggleSetup.bind(this);
  }

  onChange(e) {
    const { name, value } = e.target;
    const numbers = ['upper', 'lower'];
    if (numbers.includes(name)) {
      if (!isNaN(parseInt(value, 10))) {
        this.setState({
          [name]: parseInt(value, 10),
        });
      }
    } else {
      this.setState({
        [name]: value,
      });
    }
  }

  toggleSetup() {
    this.setState({
      setup: !this.state.setup,
    });
  }

  render() {
    const { setup } = this.state;
    return (
      <div>
        {setup
          ? <LearnSetup
            lower={this.state.lower}
            onChange={this.onChange}
            sign={this.state.sign}
            toggleSetup={this.toggleSetup}
            upper={this.state.upper}
          />
          : <LearnMath
            lower={this.state.lower}
            sign={this.state.sign}
            toggleSetup={this.toggleSetup}
            upper={this.state.upper}
          />
        }
      </div>
    );
  }
}

module.exports = App;
