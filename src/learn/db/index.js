// const zango = require('zangodb');

const MATH_DRILL_OPTIONS = 'mathDrillOptions';
const MATH_DRILL_SCORES = 'mathDrillScores';

class DB {
  static setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static getItem(key) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : item;
  }

  static saveOptions(data) {
    DB.setItem(MATH_DRILL_OPTIONS, data);
  }

  static getOptions() {
    return DB.getItem(MATH_DRILL_OPTIONS);
  }

  static saveScores(data) {
    DB.setItem(MATH_DRILL_SCORES, data);
  }

  static appendScore(score) {
    const scores = DB.getScores() || [];
    scores.push(score);
    DB.saveScores(scores);
  }

  static getScores() {
    return DB.getItem(MATH_DRILL_SCORES);
  }
}

module.exports = DB;
