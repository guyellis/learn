const helper = require('../../../../src/learn/math/drill/helper');

describe('Helper', () => {
  test('should get a pair of numbers from level #1 plus', () => {
    const pair = helper.getLowerUpper(0, [0]);
    expect(pair[0] === 1 || pair[1] === 1).toBe(true);
  });

  test('should get a random pair of numbers', () => {
    const pair = helper.getLowerUpper(4, [0]);
    expect(pair[0]).toBeLessThan(8);
    expect(pair[1]).toBeLessThan(8);
  });


  test('should getScoreBarTimes() for zero items', () => {
    const scores = [];

    const actual = helper.getScoreBarTimes(0, [0], scores);

    const expected = [];

    expect(actual).toEqual(expected);
  });

  test('should getScoreBarTimes() for single item', () => {
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

    expect(actual).toEqual(expected);
  });

  test('should sort getScoreBarTimes() for two items', () => {
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

    expect(actual).toEqual(expected);
  });

  test(
    'should not return more than 5 items getScoreBarTimes() for six items',
    () => {
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

      expect(actual).toEqual(expected);
    });
});
