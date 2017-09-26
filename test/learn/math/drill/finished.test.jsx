const constants = require('../../../../src/learn/common/constants');
const React = require('react');
const Finished = require('../../../../src/learn/math/drill/finished');
const renderer = require('react-test-renderer');
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;
const getMuiTheme = require('material-ui/styles/getMuiTheme').default;
const lightBaseTheme = require('material-ui/styles/baseThemes/lightBaseTheme').default;

const {
  RECORD_NEW,
  // RECORD_EQUAL,
  // RECORD_MISS,
  // RECORD_NOT_EXIST,
} = constants;
const muiTheme = getMuiTheme(lightBaseTheme);

describe('Finished', () => {
  test('should be rendered a new record', () => {
    const previousResults = [{
      actual: 5,
      id: 1,
      task: [5, 5, 0, 10],
      timeTaken: 2.2,
    }];
    const resultInfo = {
      text: 'Result Info Text',
      newRecordInfo: RECORD_NEW,
    };

    const component = renderer.create(
      <MuiThemeProvider muiTheme={muiTheme}>
        <Finished
          levelIndex={0}
          opIndexes={[0]}
          previousResults={previousResults}
          resultInfo={resultInfo}
          timeAllowed={600}
          timeLeft={100}
          totalProblems={20}
        />
      </MuiThemeProvider>,
    );

    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });
});
