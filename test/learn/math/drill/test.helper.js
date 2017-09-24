const helper = require('../../../../src/learn/math/drill/helper');
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

  it.skip('should getScoreBarTimes()', () => {
    // TODO: Need to mock the localStorage so that the title prop lines up
    const actual = helper.getScoreBarTimes(0, [0]);
    const expected = [{
      title: '9 hours ago',
      timePerQuestion: 1.3,
    },
    {
      title: '4 hours ago',
      timePerQuestion: 1.7,
    },
    {
      title: '4 hours ago',
      timePerQuestion: 1.3,
    },
    {
      title: '3 hours ago',
      timePerQuestion: 1.3,
    },
    {
      title: '3 hours ago',
      timePerQuestion: 1,
    },
    ];
    assert.deepEqual(actual, expected);
  });
});
