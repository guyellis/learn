const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./app.jsx');

const injectTapEventPlugin = require('react-tap-event-plugin');
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;
const getMuiTheme = require('material-ui/styles/getMuiTheme').default;
const darkBaseTheme = require('material-ui/styles/baseThemes/darkBaseTheme').default;

const muiTheme = getMuiTheme(darkBaseTheme);

injectTapEventPlugin();

ReactDOM.render((
  <MuiThemeProvider muiTheme={muiTheme}>
    <App />
  </MuiThemeProvider>
), document.querySelector("#app"));
