const PreviousResults = require('../../../../src/learn/math/drill/previous-results');

describe('previous-results', () => {
  test('should sort by slowest', () => {
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
    expect(actual).toEqual(expected);
  });

  test('should getStats on an empty array', () => {
    const actual = PreviousResults.getStats([]);
    const expected = {
      correctCount: 0,
      incorrects: [],
      totalTime: 0,
    };
    expect(actual).toEqual(expected);
  });
});
