import React, { Suspense, lazy } from 'react';
import {
  Route, Switch,
} from 'react-router-dom';
import Menu from './learn/menu.jsx';

const Drill = lazy(() => import('./learn/math/drill/index.jsx'));
const Help = lazy(() => import('./learn/help/index.jsx'));
const Home = lazy(() => import('./learn/home.jsx'));
const Scoreboard = lazy(() => import('./learn/math/drill/scoreboard.jsx'));
const NotFound = lazy(() => import('./learn/not-found.jsx'));

function app() {
  return (
    <div>
      <Route path="/" component={Menu} />
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/math/drill" exact component={Drill} />
          <Route path="/math/score" exact component={Scoreboard} />
          <Route path="/help" exact component={Help} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </div>
  );
}

export default app;
