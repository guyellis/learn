import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
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
          <Route element={<Home />} path="/" />
          <Route element={<Drill />} path="/math/drill" />
          <Route element={<Scoreboard />} path="/math/score" />
          <Route element={<Help />} path="/help" />
          <Route element={<NotFound />} path="*" />
        </Routes>
      </Suspense>
    </div>
  );
}

export default app;
