const db = require('../../../../src/learn/db');
const helper = require('../../../../src/learn/math/drill/helper');
const constants = require('../../../../src/learn/common/constants');

const {
  RECORD_NEW,
  RECORD_EQUAL,
  RECORD_MISS,
  RECORD_NOT_EXIST,
  // BADGE_BOUNDARIES: badgeBoundaries,
  // COLOR_HTML,
} = constants;

describe('Helper', () => {
  beforeEach(() => {
    db.getScores = jest.fn();
    db.appendScore = jest.fn();
  });

  afterEach(() => {
    db.getScores.mockClear();
    db.appendScore.mockClear();
  });

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
    },
  );

  test('should calculate all Answer operators', () => {
    const { calculateAnswer } = helper;
    const inputs = [
      [[6, 3], 0, 9], // 6 + 3 = 9
      [[6, 3], 1, 3], // 6 - 3 = 3
      [[6, 3], 2, 18], // 6 x 3 = 18
      [[6, 3], 3, 2], // 6 / 3 = 2
      [[6, 3], 4, 0], // Unknown operator returns 0
    ];

    inputs.forEach((input) => {
      const [pair, operator, expected] = input;
      const actual = calculateAnswer(pair, operator);
      expect(actual).toBe(expected);
    });
  });

  test('should get current record if data exists', () => {
    db.getScores.mockReturnValueOnce([{
      key: '001',
      timePerQuestion: 2,
    }, {
      key: '002',
      timePerQuestion: 0.5,
    }, {
      key: '001',
      timePerQuestion: 1,
    }]);
    const { getCurrentRecord } = helper;

    const actual = getCurrentRecord(0, [0, 1]);
    expect(actual).toEqual({
      key: '001',
      timePerQuestion: 1,
    });
  });

  test('should get undefined for current record if no data exists', () => {
    db.getScores.mockReturnValueOnce(undefined);
    const { getCurrentRecord } = helper;

    const actual = getCurrentRecord(0, [0, 1]);
    expect(actual).toBeUndefined();
  });

  test('should append score with no existing record', () => {
    db.getScores.mockReturnValueOnce(undefined);
    const { appendScore } = helper;
    const results = {
      correctCount: 10,
      levelIndex: 0,
      minutes: 10, // in minutes
      opIndexes: [0],
      previousResults: [], // TODO: A test where this is undefined
      questionsRemaining: 0,
      timeLeft: 540, // in seconds
      totalProblems: 10,
    };

    const actual = appendScore(results);
    expect(actual).toEqual({
      // eslint-disable-next-line no-multi-str
      text: 'This is the first time you\'ve done this problem. You took \
6 seconds per question. Do this test again to see if you can \
beat this score. Good luck!',
      newRecordInfo: RECORD_NOT_EXIST,
    });
    expect(db.getScores).toHaveBeenCalled();
    expect(db.appendScore).toHaveBeenCalled();
  });

  test('should not append score if no correct answers', () => {
    db.getScores.mockReturnValueOnce(undefined);
    const { appendScore } = helper;
    const results = {
      correctCount: 0,
      levelIndex: 0,
      minutes: 10, // in minutes
      opIndexes: [0],
      previousResults: [], // TODO: A test where this is undefined
      questionsRemaining: 0,
      timeLeft: 540, // in seconds
      totalProblems: 10,
    };

    const actual = appendScore(results);
    expect(actual).toEqual({
      // eslint-disable-next-line no-multi-str
      text: 'You didn\'t answer any questions correctly so we are not going to use this score \
as part of your high scores. If you are struggling with these problems then try an \
easier level or an easier operator.',
      newRecordInfo: RECORD_MISS,
    });
    expect(db.getScores).toHaveBeenCalled();
    expect(db.appendScore).not.toHaveBeenCalled();
  });

  test('should report an equal record', () => {
    db.getScores.mockReturnValueOnce([{
      timePerQuestion: 6,
      key: '00',
    }]);
    const { appendScore } = helper;
    const results = {
      correctCount: 10,
      levelIndex: 0,
      minutes: 10, // in minutes
      opIndexes: [0],
      previousResults: [], // TODO: A test where this is undefined
      questionsRemaining: 0,
      timeLeft: 540, // in seconds
      totalProblems: 10,
    };

    const actual = appendScore(results);
    expect(actual).toEqual({
      // eslint-disable-next-line no-multi-str
      text: 'Your time is equal to your best score of 6 seconds per question. Great job!',
      newRecordInfo: RECORD_EQUAL,
    });
    expect(db.getScores).toHaveBeenCalled();
    expect(db.appendScore).toHaveBeenCalled();
  });

  test('should report a new record', () => {
    db.getScores.mockReturnValueOnce([{
      timePerQuestion: 7,
      key: '00',
    }]);
    const { appendScore } = helper;
    const results = {
      correctCount: 10,
      levelIndex: 0,
      minutes: 10, // in minutes
      opIndexes: [0],
      previousResults: [], // TODO: A test where this is undefined
      questionsRemaining: 0,
      timeLeft: 540, // in seconds
      totalProblems: 10,
    };

    const actual = appendScore(results);
    expect(actual).toEqual({
      // eslint-disable-next-line no-multi-str
      text: 'NEW RECORD! Awesome work! Your new best score is 6 seconds per question.',
      newRecordInfo: RECORD_NEW,
    });
    expect(db.getScores).toHaveBeenCalled();
    expect(db.appendScore).toHaveBeenCalled();
  });

  test('should report a new record', () => {
    db.getScores.mockReturnValueOnce([{
      timePerQuestion: 5,
      key: '00',
    }]);
    const { appendScore } = helper;
    const results = {
      correctCount: 10,
      levelIndex: 0,
      minutes: 10, // in minutes
      opIndexes: [0],
      previousResults: [], // TODO: A test where this is undefined
      questionsRemaining: 0,
      timeLeft: 540, // in seconds
      totalProblems: 10,
    };

    const actual = appendScore(results);
    expect(actual).toEqual({
      // eslint-disable-next-line no-multi-str
      text: 'You answered the questions at a rate of 6 seconds \
per question. (Your best score is 5 seconds per question.)',
      newRecordInfo: RECORD_MISS,
    });
    expect(db.getScores).toHaveBeenCalled();
    expect(db.appendScore).toHaveBeenCalled();
  });
});
