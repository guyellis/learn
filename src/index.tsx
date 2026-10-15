import './index.scss';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app.js';
import poly from './poly.js';
import { AppThemeProvider } from './theme/app-theme-provider.js';

poly(undefined, async (err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  if (!('Temporal' in globalThis)) {
    const { Temporal, toTemporalInstant } = await import('@js-temporal/polyfill');
    (globalThis as unknown as { Temporal: unknown }).Temporal = Temporal;
    (Date.prototype as unknown as { toTemporalInstant: unknown }).toTemporalInstant =
      toTemporalInstant;
  }

  const container = document.querySelector('#app');
  if (container) {
    const root = createRoot(container);
    root.render(
      <AppThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppThemeProvider>,
    );
  }
});
