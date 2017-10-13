const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./app.jsx');
const poly = require('./poly');
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;
const getMuiTheme = require('material-ui/styles/getMuiTheme').default;
const lightBaseTheme = require('material-ui/styles/baseThemes/lightBaseTheme').default;

const muiTheme = getMuiTheme(lightBaseTheme);

poly(undefined, (err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  ReactDOM.render(
    (
      <MuiThemeProvider muiTheme={muiTheme}>
        <App />
      </MuiThemeProvider>
    ), document.querySelector('#app'),
  );
});
