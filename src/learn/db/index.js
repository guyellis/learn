const constants = require('../common/constants');

const {
  MATH_DRILL_OPTIONS,
  MATH_DRILL_SCORES,
} = constants;

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
    let options = DB.getItem(MATH_DRILL_OPTIONS);
    if (options) {
      if (typeof options.userName !== 'string') {
        options.userName = '';
        DB.saveOptions(options);
      }
      if (typeof options.largeKeyboard !== 'boolean') {
        options.largeKeyboard = false;
        DB.saveOptions(options);
      }
      if (typeof options.opIndex === 'number') {
        options.opIndexes = [options.opIndex];
        delete options.opIndex;
        DB.saveOptions(options);
      }
    } else {
      options = {
        largeKeyboard: false,
        levelIndex: 0, // A
        minutes: '1',
        onscreenKeyboard: true,
        opIndexes: [0], // +
        totalProblems: '20',
        userName: '',
      };
      DB.saveOptions(options);
    }
    return options;
  }

  static saveScores(data) {
    DB.setItem(MATH_DRILL_SCORES, data);
  }

  static appendScore(score) {
    const scores = DB.getScores() || [];
    scores.push(score);
    DB.saveScores({
      version: 2,
      scores,
    });
  }

  static getScores() {
    const scores = DB.getItem(MATH_DRILL_SCORES);

    if (Array.isArray(scores)) {
      // Need to change it to an object and the previousResults array needs to have the
      // actual property changed to an actuals array.
      scores.forEach((score) => {
        if (score.previousResults) {
          score.previousResults.forEach((previousResult) => {
            if (previousResult.actual) {
            // eslint-disable-next-line no-param-reassign
              previousResult.actuals = [previousResult.actual];
              // eslint-disable-next-line no-param-reassign
              delete previousResult.actual;
            }
          });
        }
      });
      DB.saveScores({
        version: 2,
        scores,
      });
      return DB.getScores();
    }
    return scores && scores.scores;
  }
}

module.exports = DB;
