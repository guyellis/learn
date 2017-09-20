require('bootstrap/dist/css/bootstrap.min.css');
const React = require('react');
const Home = require('./learn/home');
const { Route, Redirect } = require('react-router-dom');
const Drill = require('./learn/math/drill');
const Scoreboard = require('./learn/math/drill/scoreboard');
const Help = require('./learn/help');

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
