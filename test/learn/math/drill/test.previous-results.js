const assert = require('assert');
const PreviousResults = require('../../../../src/learn/math/drill/previous-results');

describe('previous-results', () => {
  it('should work with no params', () => {
    const previous = new PreviousResults();
    assert.equal(previous.first(), undefined);
    assert.equal(previous.last(), undefined);
    const stats = previous.getStats();
    assert.deepEqual(stats, {
      correctCount: 0,
      incorrects: [],
      totalTime: 0,
    });
  });
});
