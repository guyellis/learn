const React = require('react');
const renderer = require('react-test-renderer');
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;
const getMuiTheme = require('material-ui/styles/getMuiTheme').default;
const lightBaseTheme = require('material-ui/styles/baseThemes/lightBaseTheme').default;
const {
  MemoryRouter,
} = require('react-router-dom');
const App = require('../src/app');

const muiTheme = getMuiTheme(lightBaseTheme);

describe('App', () => {
  test('should render an App component', () => {
    const component = renderer.create(
      <MuiThemeProvider muiTheme={muiTheme}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </MuiThemeProvider>);

    const app = component.toJSON();
    expect(app).toMatchSnapshot();
  });
});
