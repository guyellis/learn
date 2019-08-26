const PropTypes = require('prop-types');
const React = require('react');
const Grid = require('@material-ui/core/Grid').default;
const Box = require('@material-ui/core/Box').default;
const constants = require('../../common/constants');
const QuizLine = require('./quiz-line');
const RunningResults = require('./running-results');

const {
  ALPHABET: alphabet,
  OPERATIONS: operations,
} = constants;

function running(props) {
  const {
    checkAnswer,
    currentTask,
    largeKeyboard,
    levelIndex,
    newRecord,
    onscreenKeyboard,
    opIndexes,
    previousResults,
    questionsRemaining,
    timeLeft,
  } = props;

  if (!currentTask) {
    // eslint-disable-next-line no-console
    console.warn('No currentTask defined in renderRunning');
    return null;
  }

  const lastTen = previousResults.slice(Math.max(0, previousResults.length - 10)).reverse();
  const lastResult = lastTen[0];

  return (
    <div>
      <Grid
        container
        direction="row"
      >
        <Grid item xs>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            <div>
              <Box fontSize={23} fontWeight="fontWeightLight" m={1}>
Level:
              </Box>
            </div>
            <div>
              <Box fontSize={28} fontWeight="fontWeightBold" m={1}>
                {alphabet[levelIndex]}
              </Box>
            </div>
          </Grid>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            <div>
              <Box fontSize={23} fontWeight="fontWeightLight" m={1}>
Operation(s):
              </Box>
            </div>
            <div>
              <Box fontSize={28} fontWeight="fontWeightBold" m={1}>
                {opIndexes.map(i => operations[i]).join()}
              </Box>
            </div>
          </Grid>
        </Grid>

        <Grid item xs>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            <div>
              <Box fontSize={23} fontWeight="fontWeightLight" m={1}>
Time Left:
              </Box>
            </div>
            <div>
              <Box fontSize={28} fontWeight="fontWeightBold" m={1}>
                {`${timeLeft}`}
              </Box>
            </div>
            <div>
              <Box fontSize={16} fontWeight="fontWeightLight" m={1}>
seconds
              </Box>
            </div>
          </Grid>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            <div>
              <Box fontSize={23} fontWeight="fontWeightLight" m={1}>
Questions Remaining:
              </Box>
            </div>
            <div>
              <Box fontSize={28} fontWeight="fontWeightBold" m={1}>
                {questionsRemaining}
              </Box>
            </div>
          </Grid>
        </Grid>

      </Grid>
      <div>
        <QuizLine
          checkAnswer={checkAnswer}
          lastResult={lastResult}
          newRecord={newRecord}
          onscreenKeyboard={onscreenKeyboard}
          problem={currentTask}
          largeKeyboard={largeKeyboard}
        />
        <RunningResults
          previousResults={lastTen}
          showIndex
        />
      </div>
    </div>
  );
}

running.propTypes = {
  checkAnswer: PropTypes.func.isRequired,
  currentTask: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  largeKeyboard: PropTypes.bool.isRequired,
  levelIndex: PropTypes.number.isRequired,
  newRecord: PropTypes.shape({
    isNewRecord: PropTypes.bool.isRequired,
    currentTimePerQuestion: PropTypes.number.isRequired,
    existingRecordTimePerQuestion: PropTypes.number.isRequired,
  }).isRequired,
  onscreenKeyboard: PropTypes.bool.isRequired,
  opIndexes: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  previousResults: PropTypes.arrayOf(PropTypes.shape({
    task: PropTypes.array.isRequired, // left, right, opIndex, answer
    actuals: PropTypes.arrayOf(PropTypes.number).isRequired,
    timeTaken: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
  })).isRequired,
  questionsRemaining: PropTypes.number.isRequired,
  timeLeft: PropTypes.number.isRequired,
};

running.defaultProps = {
  // currentRecord: null,
};

module.exports = running;
