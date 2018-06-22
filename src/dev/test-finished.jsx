// Used for experimenting with components that are WIP

const React = require('react');
const constants = require('../learn/common/constants');
const Finished = require('../learn/math/drill/finished');

const {
  RECORD_NEW,
  // RECORD_EQUAL,
  // RECORD_MISS,
  // RECORD_NOT_EXIST,
} = constants;

const a = [...Array(10).keys()];

function tester() {
  const previousResults = a.map(id => ({
    actuals: [5],
    id,
    task: [5, 5, 0, 5],
    timeTaken: 1 + parseFloat((1.1 * id).toFixed(1), 10),
  }));
  const resultInfo = {
    text: 'Result Info Text',
    newRecordInfo: RECORD_NEW,
  };
  const scoreBarTimes = [{
    date: Date.now() - (1000 * 60 * 10),
    timePerQuestion: 1.5,
  }, {
    date: Date.now() - (1000 * 60 * 8),
    timePerQuestion: 3.5,
  }, {
    date: Date.now() - (1000 * 60 * 6),
    timePerQuestion: 3.5,
  }, {
    date: Date.now() - (1000 * 60 * 4),
    timePerQuestion: 4.5,
  }, {
    date: Date.now() - (1000 * 60 * 2),
    timePerQuestion: 1.5,
  }];

  return (
    <Finished
      levelIndex={0}
      opIndexes={[0]}
      previousResults={previousResults}
      resultInfo={resultInfo}
      scoreBarTimes={scoreBarTimes}
      timeAllowed={600}
      timeLeft={100}
      totalProblems={20}
    />
  );
}

module.exports = tester;
