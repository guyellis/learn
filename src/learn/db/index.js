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
      version: 3,
      scores,
    });
  }


  /**
   * Converts the scores in localStorage from Version 1 to 2
   * @static
   * @param {array} scores - Version 1 array of scores
   * @returns {object} - new scores shape
   * @memberof DB
   */
  static convertVersion1(scores) {
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

    return {
      version: 2,
      scores,
    };
  }


  /**
   * Converts the scores in localStorage from Version 2 to 3
   * @static
   * @param {object} scores - version 2 scores
   * @memberof DB
   */
  static convertVersion2(scoresObj) {
    const { version, scores } = scoresObj;
    if (version !== 2) {
      throw new Error(`version must be 2 and not ${version} in convertVersion2`);
    }
    // Fix bug - "key" in scores objects should have had a delimiter between the level
    // and the operators.
    scores.forEach((score) => {
      const { levelIndex, opIndexes } = score;
      // eslint-disable-next-line no-param-reassign
      score.key = `${levelIndex}-${opIndexes.sort().join('')}`;
    });

    return {
      version: 3,
      scores,
    };
  }

  static getScores() {
    const scores = DB.getItem(MATH_DRILL_SCORES);

    if (Array.isArray(scores)) {
      const convertedScores = DB.convertVersion1(scores);
      DB.saveScores(convertedScores);
      return DB.getScores();
    }

    if (scores && scores.version === 2) {
      const convertedScores = DB.convertVersion2(scores);
      DB.saveScores(convertedScores);
      return DB.getScores();
    }

    return scores && scores.scores;
  }
}

module.exports = DB;
