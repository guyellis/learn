
const React = require('react');
const QuizLine = require('../../../../src/learn/math/drill/quiz-line');
const renderer = require('react-test-renderer');
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;
const getMuiTheme = require('material-ui/styles/getMuiTheme').default;
const lightBaseTheme = require('material-ui/styles/baseThemes/lightBaseTheme').default;

const muiTheme = getMuiTheme(lightBaseTheme);

test('Badge totals should be rendered', () => {
  const component = renderer.create(
    <MuiThemeProvider muiTheme={muiTheme}>
      <QuizLine
        checkAnswer={jest.fn()}
        newRecord={{
          isNewRecord: false,
          currentTimePerQuestion: 1.1,
          existingRecordTimePerQuestion: 1,
        }}
        onscreenKeyboard={false}
        largeKeyboard={false}
        problem={[1, 1, 0, 2]}
      />
    </MuiThemeProvider>);
  const badgeTotals = component.toJSON();
  expect(badgeTotals).toMatchSnapshot();
});
