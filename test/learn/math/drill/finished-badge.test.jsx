
const React = require('react');
const renderer = require('react-test-renderer');
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;
const getMuiTheme = require('material-ui/styles/getMuiTheme').default;
const lightBaseTheme = require('material-ui/styles/baseThemes/lightBaseTheme').default;
const FinishedBadge = require('../../../../src/learn/math/drill/finished-badge');

const muiTheme = getMuiTheme(lightBaseTheme);

describe('Finished Badge', () => {
  test('should be rendered on happy path', () => {
    const component = renderer.create(
      <MuiThemeProvider muiTheme={muiTheme}>
        <FinishedBadge
          levelIndex={0}
          opIndexes={[0]}
          timePerQuestion={2.2}
          totalCorrectAnswers={10}
        />
      </MuiThemeProvider>);
    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });

  test('should be rendered if multiple opIndexes', () => {
    const component = renderer.create(
      <MuiThemeProvider muiTheme={muiTheme}>
        <FinishedBadge
          levelIndex={0}
          opIndexes={[0, 1]}
          timePerQuestion={2.2}
          totalCorrectAnswers={10}
        />
      </MuiThemeProvider>);
    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });

  test('should not be rendered if correct answers under 10', () => {
    const component = renderer.create(
      <MuiThemeProvider muiTheme={muiTheme}>
        <FinishedBadge
          levelIndex={0}
          opIndexes={[0]}
          timePerQuestion={2.2}
          totalCorrectAnswers={9}
        />
      </MuiThemeProvider>);
    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });
});
