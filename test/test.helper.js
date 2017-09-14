const helper = require('../src/learn/math/drill/helper');
const assert = require('assert');

describe('Helper', () => {
  it('should get a pair of numbers from level #1 plus', () => {
    const pair = helper.getLowerUpper(0, [0]);
    assert(pair[0] === 1 || pair[1] === 1);
  });

  it('should get a random pair of numbers', () => {
    const pair = helper.getLowerUpper(4, [0]);
    assert(pair[0] < 8);
    assert(pair[1] < 8);
  });
});
