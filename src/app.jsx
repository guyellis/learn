const { Route, Redirect } = require('react-router-dom');
const Drill = require('./learn/math/drill');
const Help = require('./learn/help');
const Home = require('./learn/home');
const Menu = require('./learn/menu');
const React = require('react');
const Scoreboard = require('./learn/math/drill/scoreboard');

// const Tester = require('./tester');
// <Route path="/" exact component={Tester} />

function app() {
  return (
    <div>
      <Route path="/" component={Menu} />
      <Route path="/" exact component={Home} />
      <Route path="/math/drill" exact component={Drill} />
      <Route path="/math/score" exact component={Scoreboard} />
      <Route path="/help" exact component={Help} />
      <Redirect to="/" />
    </div>
  );
}

module.exports = app;
