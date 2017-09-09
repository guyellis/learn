require('bootstrap/dist/css/bootstrap.min.css');
const React = require('react');
const Home = require('./learn/home');
const { Route, Redirect } = require('react-router-dom');
const Drill = require('./learn/math/drill');

function app() {
  return (
    <div>
      <Route path="/" exact component={Home} />
      <Route path="/math/drill" exact component={Drill} />
      <Redirect to="/" />
    </div>
  );
}

module.exports = app;
