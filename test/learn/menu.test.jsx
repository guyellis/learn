const React = require('react');
const Menu = require('../../src/learn/menu');
const renderer = require('react-test-renderer');
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;
const getMuiTheme = require('material-ui/styles/getMuiTheme').default;
const lightBaseTheme = require('material-ui/styles/baseThemes/lightBaseTheme').default;
const {
  MemoryRouter,
} = require('react-router-dom');

const muiTheme = getMuiTheme(lightBaseTheme);

describe('Menu', () => {
  test('should render a Menu component', () => {
    const component = renderer.create(
      <MuiThemeProvider muiTheme={muiTheme}>
        <MemoryRouter>
          <Menu />
        </MemoryRouter>
      </MuiThemeProvider>);

    const app = component.toJSON();
    expect(app).toMatchSnapshot();
  });
});
