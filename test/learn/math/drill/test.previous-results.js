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

  it('should slice an array', () => {
    const previous = new PreviousResults([1, 2, 3]);
    const sliced = previous.slice(1);
    assert.deepEqual(sliced, [2, 3]);
  });

  it('should push a value', () => {
    const previous = new PreviousResults([1]);
    assert.deepEqual(previous.raw, [1]);
    previous.push(2);
    assert.deepEqual(previous.raw, [1, 2]);
  });
});
