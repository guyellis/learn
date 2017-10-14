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
    localStorage.getItem.mockReturnValueOnce(undefined);
    const actual = db.getItem('key');
    expect(actual).toBeUndefined();
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
    localStorage.getItem.mockReturnValueOnce(JSON.stringify([1, 2]));
    db.appendScore(3);
    expect(localStorage.setItem).toHaveBeenCalledWith(MATH_DRILL_SCORES, JSON.stringify([1, 2, 3]));
  });

  test('should append scores when score collection is empty', () => {
    localStorage.getItem.mockReturnValueOnce(null);
    db.appendScore(3);
    expect(localStorage.setItem).toHaveBeenCalledWith(MATH_DRILL_SCORES, JSON.stringify([3]));
  });
});
