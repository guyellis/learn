import './index.scss';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import React from 'react';
import ReactDOM from 'react-dom';
import lightBaseThemePkg from 'material-ui/styles/baseThemes/lightBaseTheme';
import { BrowserRouter } from 'react-router-dom';
import poly from './poly.js';
import App from './app.jsx';

const lightBaseTheme = lightBaseThemePkg.default || lightBaseThemePkg;
const theme = createMuiTheme(lightBaseTheme);

poly(undefined, (err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  ReactDOM.render(
    (
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MuiThemeProvider>
    ), document.querySelector('#app'),
  );
});
