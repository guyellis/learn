const db = require('../../../src/learn/db');
const constants = require('../../../src/learn/common/constants');

const {
  MATH_DRILL_OPTIONS,
  MATH_DRILL_SCORES,
} = constants;

describe('DB', () => {
  beforeEach(() => {
    localStorage.setItem = jest.fn();
    localStorage.getItem = jest.fn();
  });

  afterEach(() => {
    localStorage.setItem.mockClear();
    localStorage.getItem.mockClear();
  });

  test('should set an item', () => {
    const value = { prop: 'one' };
    db.setItem('key', value);
    expect(localStorage.setItem).toHaveBeenCalledWith('key', JSON.stringify(value));
  });

  test('should get an item', () => {
    const value = { prop: 'one' };
    localStorage.getItem.mockReturnValueOnce(JSON.stringify(value));
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
      version: 2,
      scores: [1, 2],
    }));
    db.appendScore(3);
    expect(localStorage.setItem).toHaveBeenCalledWith(MATH_DRILL_SCORES, JSON.stringify({
      version: 2,
      scores: [1, 2, 3],
    }));
  });

  test('should append scores when score collection is empty', () => {
    localStorage.getItem.mockReturnValueOnce(null);
    db.appendScore(3);
    expect(localStorage.setItem).toHaveBeenCalledWith(MATH_DRILL_SCORES, JSON.stringify({
      version: 2,
      scores: [3],
    }));
  });

  test('should get default options when none have previously been saved', () => {
    localStorage.getItem.mockReturnValueOnce(null);
    const actual = db.getOptions();
    const defaultOptions = {
      largeKeyboard: false,
      levelIndex: 0, // A
      minutes: '1',
      onscreenKeyboard: true,
      opIndexes: [0], // +
      totalProblems: '20',
      userName: '',
    };
    expect(localStorage.setItem).toHaveBeenCalledWith(
      MATH_DRILL_OPTIONS, JSON.stringify(defaultOptions));
    expect(actual).toEqual(defaultOptions);
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
});
