import './index.scss';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app.js';
import poly from './poly.js';

const theme = createTheme({
  typography: {
    body1: {
      fontSize: '1rem',
      letterSpacing: '0.01em',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.925rem',
      letterSpacing: '0.01em',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
    fontFamily:
      '"Lexend", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontSize: 16,
    fontWeightBold: 700,
    fontWeightLight: 300,
    fontWeightMedium: 500,
    fontWeightRegular: 400,
    h1: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.005em',
      lineHeight: 1.25,
    },
    h3: {
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 500,
      lineHeight: 1.35,
    },
    h5: {
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 500,
      lineHeight: 1.45,
    },
    htmlFontSize: 16,
    subtitle1: {
      fontSize: '1.05rem',
      letterSpacing: '0.01em',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.925rem',
      letterSpacing: '0.01em',
      lineHeight: 1.5,
    },
  },
});

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
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>,
    );
  }
});
