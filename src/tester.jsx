// Used for experimenting with components that are WIP

const React = require('react');
const ScoreBar = require('./learn/math/drill/score-bar');

// const helper = require('./learn/math/drill/helper');
// const scoreParams = require('../test/fixtures/local-storage');

// const scores = JSON.parse(scoreParams.mathDrillScores);
// const times = helper.getScoreBarTimes(0, [0], scores);

const times2 = [
  {
    date: 1506199285558,
    timePerQuestion: 1.3,
  },
  {
    date: 1506216253279,
    timePerQuestion: 2.3,
  },
  {
    date: 1506218142889,
    timePerQuestion: 3.4,
  },
  {
    date: 1506218821483,
    timePerQuestion: 4.3,
  },
  {
    date: 1506218844955,
    timePerQuestion: 19,
  },
];

function tester() {
  return (
    <ScoreBar times={times2} showScoreBar />
  );
}

module.exports = tester;
