// A collection of helper functions
const db = require('../../db');
const constants = require('../../common/constants');
const moment = require('moment');
const { levelOps } = require('./helper-problems');

const {
  RECORD_NEW,
  RECORD_EQUAL,
  RECORD_MISS,
  RECORD_NOT_EXIST,
  BADGE_BOUNDARIES: badgeBoundaries,
  COLOR_HTML,
} = constants;


function calculateAnswer([left, right], opIndex) {
  switch (opIndex) {
    case 0:
      return left + right;
    case 1:
      return left - right;
    case 2:
      return left * right;
    case 3:
      // When numerator is greater than denominator we're going to treat
      // it as a zero
      return Math.floor(left / right);
    default:
      return 0;
  }
}

/**
 *
 * @param {number} levelIndex - 0 through 25 - each letter of the alphabet
 * @param {number[]} opIndexes - An array of 0 through 3 - operators +, -, *, /
 */
function getLowerUpper(levelIndexParam, opIndexes) {
  // Pick a random value from the opIndexes array
  const opIndex = opIndexes[Math.floor(Math.random() * opIndexes.length)];

  // Pick a collection of levels based on the opIndex
  const levels = levelOps[opIndex].filter(level => !!level.length);
  // Some of the last few levels are intentionally empty because it's just a repeat of
  // the final level that has values.
  const levelIndex = Math.min(levels.length, levelIndexParam);
  // Put all the levels up to levelIndex into an array except put the same number of each
  // level as the ordinal number of the level. This will gradually weight the higher levels
  // so pairs from those levels will come up more often.
  // e.g.
  // level = 0, [0]
  // level = 1: [0, 1, 1]
  // level = 2: [0, 1, 1, 2, 2, 2]
  const weightedLevels = [...Array(levelIndex + 1).keys()].reduce((acc, level) =>
    acc.concat([...Array(level + 1).keys()].map(() => level)), []);

  // Pick a random value from the array
  const levelElement = weightedLevels[Math.floor(Math.random() * weightedLevels.length)];
  // Get the array of pairs for that level
  const level = levels[Math.min(levelElement, levels.length - 1)];
  // Pick a random pair from the array
  const pair = level[Math.floor(Math.random() * level.length)];

  return [...pair, opIndex, calculateAnswer(pair, opIndex)];
}

// The key identifies a problem set by level and operators. This allows us
// to search for previous scores that used that combination to see if this
// is a new record.
function createKey(levelIndex, opIndexes) {
  return `${levelIndex.toString()}-${opIndexes.join('')}`;
}

function getCurrentRecord(levelIndex, opIndexes) {
  const existingScores = db.getScores() || [];
  const key = createKey(levelIndex, opIndexes);

  const matchingProblems = existingScores.filter(score => score.key === key).sort((a, b) =>
    a.timePerQuestion - b.timePerQuestion);
  return matchingProblems[0];
}

function appendScore(results) {
  const {
    correctCount,
    levelIndex,
    minutes,
    opIndexes: operatorIndexes,
    previousResults,
    questionsRemaining,
    timeLeft,
    totalProblems,
  } = results;
  const opIndexes = operatorIndexes.sort();

  const completed = questionsRemaining === 0;
  const timeTaken = (minutes * 60) - timeLeft;

  const timePerQuestion = correctCount === 0
    ? NaN
    : parseFloat((timeTaken / correctCount).toFixed(1));
  const incorrectCount = previousResults.length - correctCount;
  const date = Date.now();

  const resultInfo = {};
  const currentRecord = getCurrentRecord(levelIndex, opIndexes);

  // 5 scenarios
  // 1. No matching problems - first time this test has been done.
  // 2. Equals previous high score
  // 3. Beats previous high score
  // 4. Worse than previous high score
  // 5. Zero questions answered
  if (isNaN(timePerQuestion)) {
    resultInfo.text =
`You didn't answer any questions correctly so we are not going to use this score \
as part of your high scores. If you are struggling with these problems then try an \
easier level or an ${'easier'} operator.`;
    resultInfo.newRecordInfo = RECORD_MISS;
  } else if (currentRecord) {
    const { timePerQuestion: bestTimePerQuestion } = currentRecord;
    if (timePerQuestion === bestTimePerQuestion) {
      resultInfo.text =
`Your time is equal to your best score of ${timePerQuestion} seconds per question. Great job!`;
      resultInfo.newRecordInfo = RECORD_EQUAL;
    } else if (timePerQuestion < bestTimePerQuestion) {
      resultInfo.text =
`NEW RECORD! Awesome work! Your new best score is ${timePerQuestion} seconds per question.`;
      resultInfo.newRecordInfo = RECORD_NEW;
    } else {
      resultInfo.text =
`You answered the questions at a rate of ${timePerQuestion} seconds \
per question. (Your best score is ${bestTimePerQuestion} seconds per question.)`;
      resultInfo.newRecordInfo = RECORD_MISS;
    }
  } else {
    resultInfo.text = `This is the first time you've done this problem. You took \
${timePerQuestion} seconds per question. Do this test again to see if you can \
beat this score. Good luck!`;
    resultInfo.newRecordInfo = RECORD_NOT_EXIST;
  }

  if (!isNaN(timePerQuestion)) {
    const record = {
      completed,
      correctCount,
      date,
      incorrectCount,
      key: createKey(levelIndex, opIndexes),
      levelIndex,
      minutes,
      opIndexes,
      previousResults,
      questionsRemaining,
      timeLeft,
      timePerQuestion,
      timeTaken,
      totalProblems,
    };

    db.appendScore(record);
  }

  return resultInfo;
}

function getBadgeColorIndex(timePerQuestion) {
  return badgeBoundaries.reduce((badgeColor, boundary, index) =>
    (timePerQuestion > boundary ? index : badgeColor), 0);
}

function getBadgeHtmlColor(timePerQuestion) {
  const index = getBadgeColorIndex(timePerQuestion);
  return COLOR_HTML[index];
}

function getScoreBarTimes(levelIndex, opIndexes, scoreParams) {
  const thisKey = createKey(levelIndex, opIndexes);
  const scores = scoreParams || db.getScores() || [];
  const filteredScores = scores
    .filter(({ key, correctCount }) => key === thisKey && correctCount > 9)
    .sort((a, b) => a.date - b.date);
  if (!filteredScores.length) {
    return [];
  }

  return filteredScores
    .slice(-5)
    .map(({ date, timePerQuestion }) => ({
      date,
      timePerQuestion,
    }));
}


function getScoreboard() {
  const scores = db.getScores() || [];
  // totals are for badges irrespective of operators so there will always be
  // 4 of these for Gold, Silver, Bronze and Blue
  const totals = [0, 0, 0, 0];

  // levelOperators has keys (props) that map to both the level and operator(s) that were used
  // and aggregate the scores based on this.
  // Example keys:
  // '00' - Level A Addition
  // '313' - Level D Mixed Subtraction/Division
  // The values are arrays of 4 elements that match to badge colors and the number of
  // badges at that level/operator(s)
  // Example value:
  // [0, 5, 2, 1] - 0 Gold, 5 Silver, 2 Bronze, 1 Blue
  const levelOperators = scores.reduce((acc, score) => {
    const {
      levelIndex,
      correctCount,
      opIndexes,
      timePerQuestion,
    } = score;

    // Filter down the scores to just those that have
    // at least 10 correct answers
    if (correctCount > 9) {
      const key = createKey(levelIndex, opIndexes);
      if (!acc[key]) {
        acc[key] = [0, 0, 0, 0];
      }
      const levelOp = acc[key];

      const badgeColorIndex = getBadgeColorIndex(timePerQuestion);
      totals[badgeColorIndex] += 1;
      levelOp[badgeColorIndex] += 1;
    }

    return acc;
  }, {});

  // ops is a collection of strings that are keys into the operators
  // used in the test. The operators are +, -, *, / and each of those
  // maps to an index value from 0 through 3.
  // For example: '0' is + and '13' is mixed - and /
  // Each new operator key is appended to this Set.
  const ops = new Set();

  // levelOperators is now an object with both the level and the operators
  // in the keys. In order to make this easy for the component to show this
  // in a table form we are now going to change it into a two dimensional
  // array. The rows will map to levels and then each row will have a collection
  // of arrays that show the number of badges for that operator(s).
  // We will need another array to map the operator(s) into the columns.
  const levels = Object.keys(levelOperators).reduce((acc, levelOperator) => {
    const [levelIndexSplit, operatorIndexes] = levelOperator.split('-');
    const levelIndex = parseInt(levelIndexSplit, 10);
    ops.add(operatorIndexes);
    if (!acc[levelIndex]) {
      acc[levelIndex] = {};
    }
    acc[levelIndex][operatorIndexes] = levelOperators[levelOperator];
    return acc;
  }, []);

  // levels now looks something like this:
  // [
  //   { '0': [0,5,3,1], '01': [0,0,0,2]},
  //   undefined,
  //   { '0': [0,5,3,1], '02': [0,0,1,2]},
  // ]
  // and ops is a set with:
  // '0', '01', '02'


  return {
    ops, // A Set of strings representing operators
    totals, // A 4 element array of badge totals
    levels, // An sparse array of up to 26 elements of objects with keys matching values in ops Set
  };
}

function currentTimePerQuestion({ previousResults, startTime }) {
  const timeElapsed = moment().diff(startTime) / 1000;
  const correctQuestions = previousResults.reduce((acc, result) => {
    // result: {"task":[1,3,0,4],"actuals":[4],"timeTaken":2.5,"id":0}
    const { task, actuals } = result;
    const [actual] = actuals;
    const [,,, answer] = task;
    return acc + Number(actual === answer);
  }, 0);
  return correctQuestions
    ? parseFloat((timeElapsed / correctQuestions).toFixed(1))
    : NaN;
}

function newRecord({ currentRecord, previousResults, startTime }) {
  const currentTime = currentTimePerQuestion({ previousResults, startTime });
  if (!currentRecord) {
    return {
      isNewRecord: false,
      currentTimePerQuestion: currentTime,
      existingRecordTimePerQuestion: NaN,
    };
  }
  const { timePerQuestion } = currentRecord;
  return {
    isNewRecord: isNaN(currentTime) ? false : timePerQuestion > currentTime,
    currentTimePerQuestion: currentTime,
    existingRecordTimePerQuestion: timePerQuestion || NaN,
  };
}

module.exports = {
  appendScore,
  calculateAnswer,
  getBadgeColorIndex,
  getBadgeHtmlColor,
  getCurrentRecord,
  getLowerUpper,
  getScoreBarTimes,
  getScoreboard,
  newRecord,
};

