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


  it('should getScoreBarTimes() for zero items', () => {
    const scores = [];

    const actual = helper.getScoreBarTimes(0, [0], scores);

    const expected = [];

    assert.deepEqual(actual, expected);
  });

  it('should getScoreBarTimes() for single item', () => {
    const scores = [{
      key: '00',
      correctCount: 10,
      date: 1,
      timePerQuestion: 1.3,
    }];

    const actual = helper.getScoreBarTimes(0, [0], scores);

    const expected = [{
      date: 1,
      timePerQuestion: 1.3,
    }];

    assert.deepEqual(actual, expected);
  });

  it('should sort getScoreBarTimes() for two items', () => {
    const scores = [{
      key: '00',
      correctCount: 22,
      date: 2,
      timePerQuestion: 2.2,
    }, {
      key: '00',
      correctCount: 11,
      date: 1,
      timePerQuestion: 1.1,
    }];

    const actual = helper.getScoreBarTimes(0, [0], scores);

    const expected = [{
      date: 1,
      timePerQuestion: 1.1,
    }, {
      date: 2,
      timePerQuestion: 2.2,
    }];

    assert.deepEqual(actual, expected);
  });

  it('should not return more than 5 items getScoreBarTimes() for six items', () => {
    const scores = [{
      key: '00',
      correctCount: 66,
      date: 6,
      timePerQuestion: 6.6,
    }, {
      key: '00',
      correctCount: 55,
      date: 5,
      timePerQuestion: 5.5,
    }, {
      key: '00',
      correctCount: 44,
      date: 4,
      timePerQuestion: 4.4,
    }, {
      key: '00',
      correctCount: 33,
      date: 3,
      timePerQuestion: 3.3,
    }, {
      key: '00',
      correctCount: 22,
      date: 2,
      timePerQuestion: 2.2,
    }, {
      key: '00',
      correctCount: 11,
      date: 1,
      timePerQuestion: 1.1,
    }];

    const actual = helper.getScoreBarTimes(0, [0], scores);

    const expected = [{
      date: 2,
      timePerQuestion: 2.2,
    }, {
      date: 3,
      timePerQuestion: 3.3,
    }, {
      date: 4,
      timePerQuestion: 4.4,
    }, {
      date: 5,
      timePerQuestion: 5.5,
    }, {
      date: 6,
      timePerQuestion: 6.6,
    }];

    assert.deepEqual(actual, expected);
  });
});
