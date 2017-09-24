const assert = require('assert');
const PreviousResults = require('../../../../src/learn/math/drill/previous-results');

describe('previous-results', () => {
  it('should sort by slowest', () => {
    const data = [{
      timeTaken: 1,
    }, {
      timeTaken: 2,
    }];
    const expected = [{
      timeTaken: 2,
    }, {
      timeTaken: 1,
    }];
    const actual = PreviousResults.sortBySlowest(data);
    assert.deepEqual(actual, expected);
  });

  it('should getStats on an empty array', () => {
    const stats = PreviousResults.getStats([]);
    assert.deepEqual(stats, {
      correctCount: 0,
      incorrects: [],
      totalTime: 0,
    });
  });
});
