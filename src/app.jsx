require('bootstrap/dist/css/bootstrap.min.css');
const React = require('react');
const LearnMath = require('./learn-math');

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      setup: true,
    };
  }

  render() {
    return (
      <LearnMath
        lower={0}
        sign={'+'}
        upper={10}
      />
    );
  }
}

module.exports = App;
