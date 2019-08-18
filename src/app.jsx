const {
  Route, Redirect, Switch,
} = require('react-router-dom');
const React = require('react');
const Drill = require('./learn/math/drill');
const Help = require('./learn/help');
const Home = require('./learn/home');
const Menu = require('./learn/menu');
const Scoreboard = require('./learn/math/drill/scoreboard');

// const Tester = require('./tester');
// <Route path="/" exact component={Tester} />

function app() {
  return (
    <div>
      <Menu>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/math/drill" exact component={Drill} />
          <Route path="/math/score" exact component={Scoreboard} />
          <Route path="/help" exact component={Help} />
          <Redirect to="/" />
        </Switch>
      </Menu>
    </div>
  );
}

module.exports = app;
