const { MuiThemeProvider, createMuiTheme } = require('@material-ui/core/styles');
const React = require('react');
const ReactDOM = require('react-dom');
const { BrowserRouter } = require('react-router-dom');
const deepPurple = require('@material-ui/core/colors/deepPurple').default;
const indigo = require('@material-ui/core/colors/indigo').default;
const poly = require('./poly');
const App = require('./app.jsx');

const theme = createMuiTheme(
  {
    palette: {
      type: 'light',
      primary: deepPurple,
      secondary: indigo,
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
  },
);

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
