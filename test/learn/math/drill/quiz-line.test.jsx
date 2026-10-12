import React from 'react';
import renderer from 'react-test-renderer';
import MuiThemeProviderPkg from 'material-ui/styles/MuiThemeProvider';
import getMuiThemePkg from 'material-ui/styles/getMuiTheme';
import lightBaseThemePkg from 'material-ui/styles/baseThemes/lightBaseTheme';
import QuizLine from '../../../../src/learn/math/drill/quiz-line.jsx';

const MuiThemeProvider = MuiThemeProviderPkg.default || MuiThemeProviderPkg;
const getMuiTheme = getMuiThemePkg.default || getMuiThemePkg;
const lightBaseTheme = lightBaseThemePkg.default || lightBaseThemePkg;

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
