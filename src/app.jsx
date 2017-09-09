require('bootstrap/dist/css/bootstrap.min.css');
const React = require('react');
const LearnMath = require('./learn/math/basic/learn-math');
const LearnSetup = require('./learn/math/basic/setup');
const constants = require('./learn/math/basic/constants');
const { Route, Redirect } = require('react-router-dom');
const Drill = require('./learn/math/drill/math-drill');

class App extends React.Component {
  constructor() {
    super();
    let settings;
    try {
      settings = JSON.parse(localStorage.getItem(constants.settings) || '{}');
    } catch (e) {
      settings = {};
    }

    this.state = Object.assign({
      lower: 0,
      setup: true,
      sign: '+',
      upper: 10,
    }, settings);
    this.saveSettings = this.saveSettings.bind(this);
    this.toggleSetup = this.toggleSetup.bind(this);
    this.simple = this.simple.bind(this);
    this.setup = this.setup.bind(this);
  }

  setup() {
    return (<LearnSetup
      lower={this.state.lower}
      sign={this.state.sign}
      saveSettings={this.saveSettings}
      upper={this.state.upper}
    />);
  }

  simple() {
    return (<LearnMath
      lower={this.state.lower}
      sign={this.state.sign}
      toggleSetup={this.toggleSetup}
      upper={this.state.upper}
    />);
  }

  toggleSetup() {
    this.setState({
      setup: !this.state.setup,
    });
  }

  saveSettings(settings) {
    localStorage.setItem(constants.settings, JSON.stringify(settings));
    this.setState(Object.assign({},
      settings,
      { setup: false }));
  }

  render() {
    return (
      <div>
        {/*
        <nav>
          <Link to="/setup">Setup</Link>
          <Link to="/simple">Simple</Link>
          <Link to="/drill">Drill</Link>
        </nav>
        */}
        <div>
          <Route path="/setup" render={this.setup} />
        </div>
        <div>
          <Route path="/simple" render={this.simple} />
        </div>
        <div>
          <Route path="/drill" exact component={Drill} />
        </div>
        <Redirect to="/drill" />
      </div>
    );
  }
}

module.exports = App;
