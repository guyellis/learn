require('bootstrap/dist/css/bootstrap.min.css');
const React = require('react');
const LearnMath = require('./learn-math');

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      setup: true
    };
  }

  render() {
    return (
      <LearnMath
        sign={'+'}
      />
    )
  }
}

module.exports = App;
