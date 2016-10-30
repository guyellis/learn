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
    this.saveSettings = this.saveSettings.bind(this);
    this.toggleSetup = this.toggleSetup.bind(this);
  }

  saveSettings(settings) {
    this.setState(Object.assign({},
      settings,
      { setup: false }
    ));
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
            sign={this.state.sign}
            saveSettings={this.saveSettings}
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
