const React = require('react');
const renderer = require('react-test-renderer');
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;
const getMuiTheme = require('material-ui/styles/getMuiTheme').default;
const lightBaseTheme = require('material-ui/styles/baseThemes/lightBaseTheme').default;
const Drill = require('../../../../src/learn/math/drill');

const muiTheme = getMuiTheme(lightBaseTheme);

jest.mock('material-ui/internal/EnhancedSwitch');

describe('Drill', () => {
  beforeEach(() => {
    localStorage.setItem = jest.fn();
    localStorage.getItem = jest.fn();
  });

  afterEach(() => {
    localStorage.setItem.mockClear();
    localStorage.getItem.mockClear();
  });

  test('should render the Drill component', () => {
    const savedOptions = {
      largeKeyboard: true,
      levelIndex: 0, // A
      minutes: '1',
      onscreenKeyboard: true,
      opIndexes: [0], // A
      totalProblems: '20',
      userName: 'my name',
    };
    localStorage.getItem.mockReturnValue(JSON.stringify(savedOptions));

    const component = renderer.create(
      <MuiThemeProvider muiTheme={muiTheme}>
        <Drill />
      </MuiThemeProvider>);

    const app = component.toJSON();
    expect(app).toMatchSnapshot();
  });
});
