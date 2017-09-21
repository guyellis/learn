const { Route, Redirect } = require('react-router-dom');
const Drill = require('./learn/math/drill');
const Help = require('./learn/help');
const Home = require('./learn/home');
const React = require('react');
const Scoreboard = require('./learn/math/drill/scoreboard');

function app() {
  return (
    <div>
      <Route path="/" exact component={Home} />
      <Route path="/math/drill" exact component={Drill} />
      <Route path="/math/scoreboard" exact component={Scoreboard} />
      <Route path="/help" exact component={Help} />
      <Redirect to="/" />
    </div>
  );
}

module.exports = app;
