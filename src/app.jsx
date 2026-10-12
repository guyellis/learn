import React, { Suspense, lazy } from 'react';
import {
  Route, Routes,
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
      <Menu />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/math/drill" element={<Drill />} />
          <Route path="/math/score" element={<Scoreboard />} />
          <Route path="/help" element={<Help />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default app;
