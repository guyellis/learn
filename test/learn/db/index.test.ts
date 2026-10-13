import type { MockInstance } from 'vitest';
import constants from '../../../src/learn/common/constants.js';
import db from '../../../src/learn/db/index.js';

const { MATH_DRILL_OPTIONS, MATH_DRILL_SCORES } = constants;

describe('DB', () => {
  let getItemMock: MockInstance;
  let setItemMock: MockInstance;
  let removeItemMock: MockInstance;

  beforeEach(() => {
    setItemMock = vi.spyOn(Storage.prototype, 'setItem');
    getItemMock = vi.spyOn(Storage.prototype, 'getItem');
    removeItemMock = vi.spyOn(Storage.prototype, 'removeItem');
  });

  afterEach(() => {
    getItemMock.mockRestore();
    setItemMock.mockRestore();
    removeItemMock.mockRestore();
  });

  test('should set an item', () => {
    const value = { prop: 'one' };

    db.setItem('key', value);
    expect(setItemMock).toHaveBeenCalledWith('key', JSON.stringify(value));
  });

  test('should get an item', () => {
    const value = { prop: 'one' };

    getItemMock.mockReturnValueOnce(JSON.stringify(value));

    const actual = db.getItem('key');
    expect(actual).toEqual(value);
  });

  test('should get a falsy item', () => {
    getItemMock.mockReturnValueOnce(null);
    const actual = db.getItem('key');
    expect(actual).toBeNull();
  });

  test('should remove an item', () => {
    db.removeItem('key');
    expect(removeItemMock).toHaveBeenCalledWith('key');
  });

  test('should save options', () => {
    const value = { prop: 'one' };
    db.saveOptions(value);
    expect(setItemMock).toHaveBeenCalledWith(MATH_DRILL_OPTIONS, JSON.stringify(value));
  });

  test('should save scores', () => {
    const value = { prop: 'one' };
    db.saveScores(value);
    expect(setItemMock).toHaveBeenCalledWith(MATH_DRILL_SCORES, JSON.stringify(value));
  });

  test('should clear scores', () => {
    db.clearScores();
    expect(removeItemMock).toHaveBeenCalledWith(MATH_DRILL_SCORES);
  });

  test('should append scores', () => {
    getItemMock.mockReturnValueOnce(
      JSON.stringify({
        scores: [1, 2],
        version: 3,
      }),
    );
    db.appendScore(3);
    expect(setItemMock).toHaveBeenCalledWith(
      MATH_DRILL_SCORES,
      JSON.stringify({
        scores: [1, 2, 3],
        version: 3,
      }),
    );
  });

  test('should append scores when score collection is empty', () => {
    getItemMock.mockReturnValueOnce(null);
    db.appendScore(3);
    expect(setItemMock).toHaveBeenCalledWith(
      MATH_DRILL_SCORES,
      JSON.stringify({
        scores: [3],
        version: 3,
      }),
    );
  });

  test('should get default options when none have previously been saved', () => {
    getItemMock.mockReturnValueOnce(null);
    const actual = db.getOptions();
    const defaultOptions = {
      largeKeyboard: false,
      levelIndex: 0, // A
      minutes: '10',
      onscreenKeyboard: false,
      opIndexes: [0], // +
      totalProblems: '20',
      userName: '',
    };
    expect(setItemMock).toHaveBeenCalledWith(MATH_DRILL_OPTIONS, JSON.stringify(defaultOptions));
    expect(actual).toMatchObject(defaultOptions);
  });

  test('should get and convert options', () => {
    const savedOptions: Record<string, unknown> = {
      levelIndex: 0, // A
      minutes: '1',
      onscreenKeyboard: true,
      opIndex: 0, // +
      totalProblems: '20',
    };
    getItemMock.mockReturnValueOnce(JSON.stringify(savedOptions));

    const actual = db.getOptions();

    expect(setItemMock).toHaveBeenCalledTimes(3);

    savedOptions.userName = '';
    savedOptions.largeKeyboard = false;
    savedOptions.opIndexes = [0];
    delete savedOptions.opIndex;
    expect(setItemMock).toHaveBeenLastCalledWith(MATH_DRILL_OPTIONS, JSON.stringify(savedOptions));

    expect(actual).toEqual(savedOptions);
  });

  test('should get options that do not need converting', () => {
    const savedOptions = {
      largeKeyboard: true,
      levelIndex: 0, // A
      minutes: '1',
      onscreenKeyboard: true,
      opIndexes: [0], // A
      totalProblems: '20',
      userName: 'my name',
    };
    getItemMock.mockReturnValueOnce(JSON.stringify(savedOptions));

    const actual = db.getOptions();

    expect(setItemMock).toHaveBeenCalledTimes(0);

    expect(actual).toEqual(savedOptions);
  });

  test('should update scores and set version to current', () => {
    const scoresVersion1 = [
      {
        key: '00',
        levelIndex: 0,
        opIndexes: [0],
        previousResults: [
          {
            actual: 1,
          },
          {
            actuals: [2],
          },
        ],
      },
      {
        dummy: 1, // to test "else" in target code
        key: '00',
        levelIndex: 0,
        opIndexes: [0],
      },
    ];

    const scoresVersion2 = {
      scores: [
        {
          key: '00',
          levelIndex: 0,
          opIndexes: [0],
          previousResults: [
            {
              actuals: [1],
            },
            {
              actuals: [2],
            },
          ],
        },
        {
          dummy: 1,
          key: '00',
          levelIndex: 0,
          opIndexes: [0],
        },
      ],
      version: 2,
    };

    const scoresVersion3 = {
      scores: [
        {
          key: '0-0',
          levelIndex: 0,
          opIndexes: [0],
          previousResults: [
            {
              actuals: [1],
            },
            {
              actuals: [2],
            },
          ],
        },
        {
          dummy: 1,
          key: '0-0',
          levelIndex: 0,
          opIndexes: [0],
        },
      ],
      version: 3,
    };

    getItemMock.mockReturnValueOnce(JSON.stringify(scoresVersion1));
    getItemMock.mockReturnValueOnce(JSON.stringify(scoresVersion2));
    getItemMock.mockReturnValueOnce(JSON.stringify(scoresVersion3));

    const actual = db.getScores();

    expect(setItemMock).toHaveBeenCalledTimes(2);
    expect(setItemMock).toHaveBeenCalledWith(MATH_DRILL_SCORES, JSON.stringify(scoresVersion2));
    expect(setItemMock).toHaveBeenLastCalledWith(MATH_DRILL_SCORES, JSON.stringify(scoresVersion3));

    expect(actual).toEqual(scoresVersion3.scores);
  });

  test('should throw an error when convertVersion2 is called with version not equal to 2', () => {
    expect(() => {
      db.convertVersion2({ scores: [], version: 1 as unknown as 2 });
    }).toThrow('version must be 2 and not 1 in convertVersion2');
  });
});
