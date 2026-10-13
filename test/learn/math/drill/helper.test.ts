import constants from '../../../../src/learn/common/constants.js';
import util from '../../../../src/learn/common/util.js';
import db from '../../../../src/learn/db/index.js';
import helper from '../../../../src/learn/math/drill/helper.js';
import type { ScoreBarTime, TaskPair } from '../../../../src/learn/math/drill/types.js';

const { getScoreboard } = helper;

const { fillArray } = util;

const {
  RECORD_EQUAL,
  RECORD_MISS,
  RECORD_NEW,
  RECORD_NOT_EXIST,
  // BADGE_BOUNDARIES: badgeBoundaries,
  // COLOR_HTML,
} = constants;

describe('Helper', () => {
  beforeEach(() => {
    vi.spyOn(db, 'getScores').mockReturnValue([]);
    vi.spyOn(db, 'appendScore').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
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

  test('should default to [] when scores null in getScoreBarTimes()', () => {
    vi.mocked(db.getScores).mockReturnValueOnce(null);

    const actual = helper.getScoreBarTimes(0, [0]);

    const expected: ScoreBarTime[] = [];

    expect(actual).toEqual(expected);
  });

  test('should getScoreBarTimes() for zero items', () => {
    const scores: Array<{
      correctCount: number;
      date: number;
      key: string;
      timePerQuestion: number;
    }> = [];

    const actual = helper.getScoreBarTimes(0, [0], scores);

    const expected: ScoreBarTime[] = [];

    expect(actual).toEqual(expected);
  });

  test('should getScoreBarTimes() for single item', () => {
    const scores = [
      {
        correctCount: 10,
        date: 1,
        key: '0-0',
        timePerQuestion: 1.3,
      },
    ];

    const actual = helper.getScoreBarTimes(0, [0], scores);

    const expected = [
      {
        date: 1,
        timePerQuestion: 1.3,
      },
    ];

    expect(actual).toEqual(expected);
  });

  test('should get the expected number of results', () => {
    const scores: Array<{
      correctCount: number;
      date: number;
      key: string;
      timePerQuestion: number;
    }> = [];
    const expected: ScoreBarTime[] = [];
    for (let i = 0; i < 5; i += 1) {
      scores.push({
        correctCount: 10,
        date: 1,
        key: '0-0',
        timePerQuestion: 2,
      });

      const actual = helper.getScoreBarTimes(0, [0], scores);

      expected.push({
        date: 1,
        timePerQuestion: 2,
      });

      expect(actual).toEqual(expected);
    }
  });

  test('should sort getScoreBarTimes() for two items', () => {
    const scores = [
      {
        correctCount: 22,
        date: 2,
        key: '0-0',
        timePerQuestion: 2.2,
      },
      {
        correctCount: 11,
        date: 1,
        key: '0-0',
        timePerQuestion: 1.1,
      },
    ];

    const actual = helper.getScoreBarTimes(0, [0], scores);

    const expected = [
      {
        date: 1,
        timePerQuestion: 1.1,
      },
      {
        date: 2,
        timePerQuestion: 2.2,
      },
    ];

    expect(actual).toEqual(expected);
  });

  test('should not return more than 5 items getScoreBarTimes() for six items', () => {
    const scores = [
      {
        correctCount: 66,
        date: 6,
        key: '0-0',
        timePerQuestion: 6.6,
      },
      {
        correctCount: 55,
        date: 5,
        key: '0-0',
        timePerQuestion: 5.5,
      },
      {
        correctCount: 44,
        date: 4,
        key: '0-0',
        timePerQuestion: 4.4,
      },
      {
        correctCount: 33,
        date: 3,
        key: '0-0',
        timePerQuestion: 3.3,
      },
      {
        correctCount: 22,
        date: 2,
        key: '0-0',
        timePerQuestion: 2.2,
      },
      {
        correctCount: 11,
        date: 1,
        key: '0-0',
        timePerQuestion: 1.1,
      },
    ];

    const actual = helper.getScoreBarTimes(0, [0], scores);

    const expected = [
      {
        date: 2,
        timePerQuestion: 2.2,
      },
      {
        date: 3,
        timePerQuestion: 3.3,
      },
      {
        date: 4,
        timePerQuestion: 4.4,
      },
      {
        date: 5,
        timePerQuestion: 5.5,
      },
      {
        date: 6,
        timePerQuestion: 6.6,
      },
    ];

    expect(actual).toEqual(expected);
  });

  test('should calculate all Answer operators', () => {
    const { calculateAnswer } = helper;
    const inputs: Array<[TaskPair, number, number]> = [
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
    vi.mocked(db.getScores).mockReturnValueOnce([
      {
        key: '0-01',
        timePerQuestion: 2,
      },
      {
        key: '0-02',
        timePerQuestion: 0.5,
      },
      {
        key: '0-01',
        timePerQuestion: 1,
      },
    ]);
    const { getCurrentRecord } = helper;

    const actual = getCurrentRecord(0, [0, 1]);
    expect(actual).toEqual({
      key: '0-01',
      timePerQuestion: 1,
    });
  });

  test('should get undefined for current record if no data exists', () => {
    vi.mocked(db.getScores).mockReturnValueOnce(undefined);
    const { getCurrentRecord } = helper;

    const actual = getCurrentRecord(0, [0, 1]);
    expect(actual).toBeUndefined();
  });

  test('should append score with no existing record', () => {
    vi.mocked(db.getScores).mockReturnValueOnce(undefined);
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
      newRecordInfo: RECORD_NOT_EXIST,
      // eslint-disable-next-line no-multi-str
      text: "This is the first time you've done this problem. You took \
6 seconds per question. Do this test again to see if you can \
beat this score. Good luck!",
    });
    expect(db.getScores).toHaveBeenCalled();
    expect(db.appendScore).toHaveBeenCalled();
  });

  test('should not append score if no correct answers', () => {
    vi.mocked(db.getScores).mockReturnValueOnce(undefined);
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
      newRecordInfo: RECORD_MISS,
      // eslint-disable-next-line no-multi-str
      text: "You didn't answer any questions correctly so we are not going to use this score \
as part of your high scores. If you are struggling with these problems then try an \
easier level or an easier operator.",
    });
    expect(db.getScores).toHaveBeenCalled();
    expect(db.appendScore).not.toHaveBeenCalled();
  });

  test('should report an equal record', () => {
    vi.mocked(db.getScores).mockReturnValueOnce([
      {
        key: '0-0',
        timePerQuestion: 6,
      },
    ]);
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
      newRecordInfo: RECORD_EQUAL,
      // eslint-disable-next-line no-multi-str
      text: 'Your time is equal to your best score of 6 seconds per question. Great job!',
    });
    expect(db.getScores).toHaveBeenCalled();
    expect(db.appendScore).toHaveBeenCalled();
  });

  test('should report a new record', () => {
    vi.mocked(db.getScores).mockReturnValueOnce([
      {
        key: '0-0',
        timePerQuestion: 7,
      },
    ]);
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
      newRecordInfo: RECORD_NEW,
      // eslint-disable-next-line no-multi-str
      text: 'NEW RECORD! Awesome work! Your new best score is 6 seconds per question.',
    });
    expect(db.getScores).toHaveBeenCalled();
    expect(db.appendScore).toHaveBeenCalled();
  });

  test('should report a slower result', () => {
    vi.mocked(db.getScores).mockReturnValueOnce([
      {
        key: '0-0',
        timePerQuestion: 5,
      },
    ]);
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
      newRecordInfo: RECORD_MISS,
      // eslint-disable-next-line no-multi-str
      text: 'You answered the questions at a rate of 6 seconds \
per question. (Your best score is 5 seconds per question.)',
    });
    expect(db.getScores).toHaveBeenCalled();
    expect(db.appendScore).toHaveBeenCalled();
  });

  describe('getScoreboard', () => {
    test('should get null, false and 0 for no scores', () => {
      vi.mocked(db.getScores).mockReturnValueOnce(undefined);
      const expected = {
        levels: [],
        ops: new Set(),
        totals: fillArray(4, 0),
      };
      const actual = getScoreboard();

      expect(actual).toEqual(expected);
    });

    test('should get values for one score', () => {
      vi.mocked(db.getScores).mockReturnValueOnce([
        {
          correctCount: 10,
          levelIndex: 0,
          opIndexes: [0],
          timePerQuestion: 6,
        },
      ]);

      const expected = {
        levels: [{ 0: [0, 0, 0, 1] }], // Blue badge for Level A
        ops: new Set(['0']), // Operation 0 - addition
        totals: [0, 0, 0, 1], // One blue (index 3) badge in total
      };

      const actual = getScoreboard();

      expect(actual).toEqual(expected);
    });

    test('should get values for mixed operators', () => {
      vi.mocked(db.getScores).mockReturnValueOnce([
        {
          correctCount: 10,
          levelIndex: 0,
          opIndexes: [0, 1],
          timePerQuestion: 6,
        },
      ]);

      const expected = {
        levels: [{ '01': [0, 0, 0, 1] }], // Blue badge for Level A
        ops: new Set(['01']), // Operations 0 & 1 - addition/subtraction
        totals: [0, 0, 0, 1], // One blue (index 3) badge in total
      };

      const actual = getScoreboard();

      expect(actual).toEqual(expected);
    });

    test('should get values for multiple operations', () => {
      vi.mocked(db.getScores).mockReturnValueOnce([
        {
          correctCount: 10,
          levelIndex: 0,
          opIndexes: [0],
          timePerQuestion: 6,
        },
        {
          correctCount: 10,
          levelIndex: 0,
          opIndexes: [1],
          timePerQuestion: 6,
        },
      ]);

      const expected = {
        levels: [{ 0: [0, 0, 0, 1], 1: [0, 0, 0, 1] }], // Blue badge for Level A
        ops: new Set(['0', '1']), // Operations 0 & 1 - addition & subtraction
        totals: [0, 0, 0, 2], // One blue (index 3) badge in total
      };

      const actual = getScoreboard();

      expect(actual).toEqual(expected);
    });

    test('should get null, false and 0 for correct answers under 10', () => {
      vi.mocked(db.getScores).mockReturnValueOnce([
        {
          correctCount: 9,
          levelIndex: 0,
          opIndexes: [0],
          timePerQuestion: 6,
        },
      ]);

      const expected = {
        levels: [],
        ops: new Set(),
        totals: fillArray(4, 0),
      };

      const actual = getScoreboard();

      expect(actual).toEqual(expected);
    });
  });

  describe('newRecord()', () => {
    test('should return false and NaN if no data', () => {
      const { newRecord } = helper;
      const input = {
        currentRecord: {},
        previousResults: [],
        startTime: 0,
      };
      const expected = {
        currentTimePerQuestion: NaN,
        existingRecordTimePerQuestion: NaN,
        isNewRecord: false,
      };
      const actual = newRecord(input);

      expect(actual).toEqual(expected);
    });

    test('should return false and NaN if current record missing', () => {
      const { newRecord } = helper;
      const input = {
        previousResults: [],
        startTime: 0,
      };
      const expected = {
        currentTimePerQuestion: NaN,
        existingRecordTimePerQuestion: NaN,
        isNewRecord: false,
      };
      const actual = newRecord(input);

      expect(actual).toEqual(expected);
    });

    test('should return valid results with valid input', () => {
      // 2017-01-01 01:01:01
      const start = new Date(2017, 0, 1, 1, 1, 1);
      // 2017-01-01 01:01:40
      const end = new Date(2017, 0, 1, 1, 1, 40);
      const startTime = Temporal.Instant.fromEpochMilliseconds(start.getTime());
      const dateSpy = vi.spyOn(Date, 'now').mockReturnValue(end.valueOf());
      const { newRecord } = helper;
      const input = {
        currentRecord: {
          timePerQuestion: 6,
        },
        previousResults: [
          {
            actuals: [55],
            task: [0, 0, 0, 55] as [number, number, number, number],
          },
        ],
        startTime,
      };
      const expected = {
        currentTimePerQuestion: 39,
        existingRecordTimePerQuestion: 6,
        isNewRecord: false,
      };
      const actual = newRecord(input);

      expect(actual).toEqual(expected);
      dateSpy.mockRestore();
    });
  });

  describe('toInstant()', () => {
    test('should convert null, undefined, or empty values to epoch 0 instant', () => {
      expect(helper.toInstant(null).epochMilliseconds).toBe(0);
      expect(helper.toInstant(undefined).epochMilliseconds).toBe(0);
      expect(helper.toInstant(0).epochMilliseconds).toBe(0);
    });

    test('should convert number (epoch ms) to Temporal.Instant', () => {
      const instant = helper.toInstant(1500000000000);
      expect(instant).toBeInstanceOf(Temporal.Instant);
      expect(instant.epochMilliseconds).toBe(1500000000000);
    });

    test('should convert Date instance to Temporal.Instant', () => {
      const date = new Date(1500000000000);
      const instant = helper.toInstant(date);
      expect(instant).toBeInstanceOf(Temporal.Instant);
      expect(instant.epochMilliseconds).toBe(1500000000000);
    });

    test('should return same Temporal.Instant if already an Instant', () => {
      const original = Temporal.Now.instant();
      const instant = helper.toInstant(original);
      expect(instant).toBe(original);
    });

    test('should convert ISO 8601 string to Temporal.Instant', () => {
      const instant = helper.toInstant('2026-10-12T15:00:00Z');
      expect(instant).toBeInstanceOf(Temporal.Instant);
      expect(instant.toString()).toBe('2026-10-12T15:00:00Z');
    });
  });
});
