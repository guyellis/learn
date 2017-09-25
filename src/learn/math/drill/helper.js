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
  const level = levels[levelElement];
  // Pick a random pair from the array
  const pair = level[Math.floor(Math.random() * level.length)];

  return [...pair, opIndex, calculateAnswer(pair, opIndex)];
}

// The key identifies a problem set by level and operators. This allows us
// to search for previous scores that used that combination to see if this
// is a new record.
function createKey(levelIndex, opIndexes) {
  return levelIndex.toString() + opIndexes.join('');
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
      const diff = (bestTimePerQuestion - timePerQuestion).toFixed(1);
      resultInfo.text =
`NEW RECORD! Awesome work! You beat your best score by ${diff} seconds per question. \
Your previous best score was ${bestTimePerQuestion} per second and your new best score \
is ${timePerQuestion}. You are going places!`;
      resultInfo.newRecordInfo = RECORD_NEW;
    } else {
      const diff = (timePerQuestion - bestTimePerQuestion).toFixed(1);
      resultInfo.text =
`You answered the questions at a rate of ${timePerQuestion} seconds \
per question. Your best score is ${bestTimePerQuestion} per second which is ${diff} \
seconds per question faster than this. Try again to see if you can beat your best score. \
Good luck!`;
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
    .slice(filteredScores.length - 5)
    .map(({ date, timePerQuestion }) => ({
      date,
      timePerQuestion,
    }));
}


function getScoreboard() {
  const scores = db.getScores() || [];
  const totals = [0, 0, 0, 0];
  const opCounters = [0, 0, 0, 0];
  // A 2 dimensional array of 26 Levels each with an array of 4 nulls
  /*
    [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      ...
    ]
  */
  const baseLevels = [...Array(26).keys()].map(() => [...Array(4).keys()].map(() => null));
  scores.forEach((score) => {
    const {
      levelIndex,
      correctCount,
      opIndexes,
      timePerQuestion,
    } = score;

    // Filter down the scores to just those that have:
    // 1. at least 10 correct answer
    // 2. Only include single-select operators. (i.e. no multi-select mix-n-match)
    if (correctCount > 9 && opIndexes.length === 1) {
      const opIndex = opIndexes[0];
      const badges = baseLevels[levelIndex][opIndex] || [0, 0, 0, 0];
      opCounters[opIndex] += 1;

      const badgeColorIndex = getBadgeColorIndex(timePerQuestion);
      totals[badgeColorIndex] += 1;
      badges[badgeColorIndex] += 1;

      baseLevels[levelIndex][opIndex] = badges;
    }
  }, [null, null, null, null]);

  const ops = opCounters.map(Boolean);

  const levels = baseLevels.map((level) => {
    if (level.some(Boolean)) {
      return ops.reduce((acc, op, index) => {
        if (op) {
          acc.push(level[index]);
        }
        return acc;
      }, []);
    }
    // If a level is an array of nulls then replace that array of (4) nulls with a null.
    return null;
  });

  /*
  1. For titles - 4 element array - which operators are stored.
  2. For totals - 4 element array - 1 element for each Badge Color
  3. For scores:
     Levels array
       Nested operator array
         Nested collection of badges indexes + counts
         [          
           [        // Level A 
             [      // Operator +
               3,   // 3 Gold Badges
               0,   // 0 Silver Badges
               7,   // 7 Bronze Badges
               0,   // 0 Blue Badges 
             ]
           ]
         ]
  */

  // const levels = [[
  //   [3, 0, 7, 0], [3, 0, 7, 0],
  // ], [
  //   null, [3, 0, 7, 0],
  // ],
  // null, [
  //   [7, 7, 7, 7], null,
  // ]];

  return {
    ops,
    totals,
    levels,
  };
}

function currentTimePerQuestion({ previousResults, startTime }) {
  const timeElapsed = moment().diff(startTime) / 1000;
  const correctQuestions = previousResults.reduce((acc, result) => {
    // result: {"task":[1,3,0,4],"actual":4,"timeTaken":2.5,"id":0}
    const { task, actual } = result;
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

