// Used for experimenting with components that are WIP

const React = require('react');
const ScoreBar = require('./learn/math/drill/score-bar');

const helper = require('./learn/math/drill/helper');
const scoreParams = require('../test/fixtures/local-storage');

const scores = JSON.parse(scoreParams.mathDrillScores);
const times = helper.getScoreBarTimes(0, [0], scores);

function tester() {
  return (
    <ScoreBar times={times} />
  );
}

module.exports = tester;
