import React from 'react';
import {
  Route, Redirect, Switch,
} from 'react-router-dom';
import Drill from './learn/math/drill/index.jsx';
import Help from './learn/help/index.jsx';
import Home from './learn/home.jsx';
import Menu from './learn/menu.jsx';
import Scoreboard from './learn/math/drill/scoreboard.jsx';

function app() {
  return (
    <div>
      <Route path="/" component={Menu} />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/math/drill" exact component={Drill} />
        <Route path="/math/score" exact component={Scoreboard} />
        <Route path="/help" exact component={Help} />
        <Redirect to="/" />
      </Switch>
    </div>
  );
}

export default app;
