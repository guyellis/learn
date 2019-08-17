const { MuiThemeProvider, createMuiTheme } = require('@material-ui/core/styles');
const React = require('react');
const ReactDOM = require('react-dom');
const lightBaseTheme = require('material-ui/styles/baseThemes/lightBaseTheme').default;
const { BrowserRouter } = require('react-router-dom');
const poly = require('./poly');
const App = require('./app.jsx');

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
