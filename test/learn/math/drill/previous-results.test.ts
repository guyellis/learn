import PreviousResults from '../../../../src/learn/math/drill/previous-results.js';

describe('previous-results', () => {
  test('should sort by slowest', () => {
    const data = [
      {
        timeTaken: 1,
      },
      {
        timeTaken: 2,
      },
    ];
    const expected = [
      {
        timeTaken: 2,
      },
      {
        timeTaken: 1,
      },
    ];
    const actual = PreviousResults.sortBySlowest(data);
    expect(actual).toEqual(expected);
  });

  test('should default to empty array when sortBySlowest is called with no arguments', () => {
    expect(PreviousResults.sortBySlowest()).toEqual([]);
  });

  test('should default to empty array when getStats is called with no arguments', () => {
    expect(PreviousResults.getStats()).toEqual({
      correctCount: 0,
      incorrects: [],
      totalTime: 0,
    });
  });

  test('should compute stats across multiple problems including longest, shortest, and incorrects', () => {
    const p1 = {
      actuals: [2],
      id: 0,
      task: [1, 1, 0, 2] as [number, number, number, number],
      timeTaken: 5,
    };
    const p2 = {
      actuals: [4],
      id: 1,
      task: [2, 2, 0, 4] as [number, number, number, number],
      timeTaken: 8,
    };
    const p3 = {
      actuals: [5, 6],
      id: 2,
      task: [3, 3, 0, 6] as [number, number, number, number],
      timeTaken: 2,
    };
    const p4 = {
      actuals: [7],
      id: 3,
      task: [4, 4, 0, 8] as [number, number, number, number],
      timeTaken: 4,
    };

    const actual = PreviousResults.getStats([p1, p2, p3, p4]);
    expect(actual).toEqual({
      correctCount: 2,
      incorrects: [p3, p4],
      longestTime: p2,
      shortestTime: p3,
      totalTime: 19,
    });
  });
});
