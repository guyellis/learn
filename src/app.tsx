import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Menu from './learn/menu.js';

const Drill = lazy(() => import('./learn/math/drill/index.js'));
const Help = lazy(() => import('./learn/help/index.js'));
const Home = lazy(() => import('./learn/home.js'));
const Scoreboard = lazy(() => import('./learn/math/drill/scoreboard.js'));
const NotFound = lazy(() => import('./learn/not-found.js'));

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
