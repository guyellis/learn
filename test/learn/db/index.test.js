const db = require('../../../src/learn/db');
const constants = require('../../../src/learn/common/constants');

const {
  MATH_DRILL_OPTIONS,
  MATH_DRILL_SCORES,
} = constants;

describe('DB', () => {
  // beforeAll(() => {
  // });
  beforeEach(() => {
    jest.mockRestore();
    jest.spyOn(window.localStorage.prototype, 'setItem');
    jest.spyOn(window.localStorage.prototype, 'getItem');
  });
  test('should set an item', () => {
    const value = { prop: 'one' };

    jest.spyOn(window.localStorage.prototype, 'setItem');

    db.setItem('key', value);
    expect(localStorage.setItem).toHaveBeenCalledWith('key', JSON.stringify(value));
  });

  test('should get an item', () => {
    const value = { prop: 'one' };

    jest.spyOn(window.localStorage.prototype, 'getItem')
      .mockReturnValueOnce(JSON.stringify(value));

    const actual = db.getItem('key');
    expect(actual).toEqual(value);
  });

  test('should get a falsy item', () => {
    localStorage.getItem.mockReturnValueOnce(null);
    const actual = db.getItem('key');
    expect(actual).toBeNull();
  });

  test('should save options', () => {
    const value = { prop: 'one' };
    db.saveOptions(value);
    expect(localStorage.setItem).toHaveBeenCalledWith(MATH_DRILL_OPTIONS, JSON.stringify(value));
  });

  test('should save scores', () => {
    const value = { prop: 'one' };
    db.saveScores(value);
    expect(localStorage.setItem).toHaveBeenCalledWith(MATH_DRILL_SCORES, JSON.stringify(value));
  });

  test('should append scores', () => {
    localStorage.getItem.mockReturnValueOnce(JSON.stringify({
      version: 3,
      scores: [1, 2],
    }));
    db.appendScore(3);
    expect(localStorage.setItem).toHaveBeenCalledWith(MATH_DRILL_SCORES, JSON.stringify({
      version: 3,
      scores: [1, 2, 3],
    }));
  });

  test('should append scores when score collection is empty', () => {
    localStorage.getItem.mockReturnValueOnce(null);
    db.appendScore(3);
    expect(localStorage.setItem).toHaveBeenCalledWith(MATH_DRILL_SCORES, JSON.stringify({
      version: 3,
      scores: [3],
    }));
  });

  test('should get default options when none have previously been saved', () => {
    localStorage.getItem.mockReturnValueOnce(null);
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
    expect(localStorage.setItem).toHaveBeenCalledWith(
      MATH_DRILL_OPTIONS, JSON.stringify(defaultOptions));
    expect(actual).toMatchObject(defaultOptions);
  });

  test('should get and convert options', () => {
    const savedOptions = {
      levelIndex: 0, // A
      minutes: '1',
      onscreenKeyboard: true,
      opIndex: 0, // +
      totalProblems: '20',
    };
    localStorage.getItem.mockReturnValueOnce(JSON.stringify(savedOptions));

    const actual = db.getOptions();

    expect(localStorage.setItem).toHaveBeenCalledTimes(3);

    savedOptions.userName = '';
    savedOptions.largeKeyboard = false;
    savedOptions.opIndexes = [0];
    delete savedOptions.opIndex;
    expect(localStorage.setItem).toHaveBeenLastCalledWith(
      MATH_DRILL_OPTIONS, JSON.stringify(savedOptions));

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
    localStorage.getItem.mockReturnValueOnce(JSON.stringify(savedOptions));

    const actual = db.getOptions();

    expect(localStorage.setItem).toHaveBeenCalledTimes(0);

    expect(actual).toEqual(savedOptions);
  });

  test('should update scores and set version to current', () => {
    const scoresVersion1 = [{
      levelIndex: 0,
      opIndexes: [0],
      key: '00',
      previousResults: [{
        actual: 1,
      }, {
        actuals: [2],
      }],
    }, {
      levelIndex: 0,
      opIndexes: [0],
      key: '00',
      dummy: 1, // to test "else" in target code
    }];

    const scoresVersion2 = {
      version: 2,
      scores: [{
        levelIndex: 0,
        opIndexes: [0],
        key: '00',
        previousResults: [{
          actuals: [1],
        }, {
          actuals: [2],
        }],
      }, {
        levelIndex: 0,
        opIndexes: [0],
        key: '00',
        dummy: 1,
      }],
    };

    const scoresVersion3 = {
      version: 3,
      scores: [{
        levelIndex: 0,
        opIndexes: [0],
        key: '0-0',
        previousResults: [{
          actuals: [1],
        }, {
          actuals: [2],
        }],
      }, {
        levelIndex: 0,
        opIndexes: [0],
        key: '0-0',
        dummy: 1,
      }],
    };

    localStorage.getItem.mockReturnValueOnce(
      JSON.stringify(scoresVersion1));
    localStorage.getItem.mockReturnValueOnce(
      JSON.stringify(scoresVersion2));
    localStorage.getItem.mockReturnValueOnce(
      JSON.stringify(scoresVersion3));

    const actual = db.getScores();

    expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      MATH_DRILL_SCORES, JSON.stringify(scoresVersion2));
    expect(localStorage.setItem).toHaveBeenLastCalledWith(
      MATH_DRILL_SCORES, JSON.stringify(scoresVersion3));

    expect(actual).toEqual(scoresVersion3.scores);
  });
});
