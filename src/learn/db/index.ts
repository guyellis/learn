import { DEFAULT_OPTIONS, MATH_DRILL_OPTIONS, MATH_DRILL_SCORES } from '../common/constants.js';
import type { DrillOptions, ScoreRecord } from '../math/drill/types.js';

export interface V1PreviousResult {
  actual?: number;
  actuals?: number[];
  [key: string]: unknown;
}

export interface V1Score {
  key?: string;
  levelIndex?: number;
  opIndexes?: number[];
  previousResults?: V1PreviousResult[];
  [key: string]: unknown;
}

export interface V2ScoreItem {
  key?: string;
  levelIndex: number;
  opIndexes: number[];
  [key: string]: unknown;
}

export interface V2ScoresContainer {
  scores: V2ScoreItem[];
  version: number;
}

export interface V3ScoresContainer {
  scores: ScoreRecord[];
  version: number;
}

class DB {
  static setItem(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static getItem<T = unknown>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  static saveOptions(data: DrillOptions | Record<string, unknown>): void {
    DB.setItem(MATH_DRILL_OPTIONS, data);
  }

  static getOptions(): DrillOptions {
    let options = DB.getItem<DrillOptions & { opIndex?: number }>(MATH_DRILL_OPTIONS);
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
      options = DEFAULT_OPTIONS;
      DB.saveOptions(options);
    }
    return options;
  }

  static saveScores(data: unknown): void {
    DB.setItem(MATH_DRILL_SCORES, data);
  }

  static clearScores(): void {
    DB.removeItem(MATH_DRILL_SCORES);
  }

  static appendScore(score: ScoreRecord | unknown): void {
    const scores = DB.getScores() || [];
    scores.push(score as ScoreRecord);
    DB.saveScores({
      scores,
      version: 3,
    });
  }

  /**
   * Converts the scores in localStorage from Version 1 to 2
   * @static
   * @param {array} scores - Version 1 array of scores
   * @returns {object} - new scores shape
   * @memberof DB
   */
  static convertVersion1(scores: V1Score[]): { scores: V1Score[]; version: 2 } {
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
      scores,
      version: 2,
    };
  }

  /**
   * Converts the scores in localStorage from Version 2 to 3
   * @static
   * @param {object} scores - version 2 scores
   * @memberof DB
   */
  static convertVersion2(scoresObj: V2ScoresContainer): { scores: V2ScoreItem[]; version: 3 } {
    const { scores, version } = scoresObj;
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
      scores,
      version: 3,
    };
  }

  static getScores<T = ScoreRecord>(): T[] | null | undefined {
    const scores = DB.getItem(MATH_DRILL_SCORES);

    if (Array.isArray(scores)) {
      const convertedScores = DB.convertVersion1(scores as V1Score[]);
      DB.saveScores(convertedScores);
      return DB.getScores<T>();
    }

    if (
      scores &&
      typeof scores === 'object' &&
      'version' in scores &&
      (scores as { version: unknown }).version === 2
    ) {
      const convertedScores = DB.convertVersion2(scores as unknown as V2ScoresContainer);
      DB.saveScores(convertedScores);
      return DB.getScores<T>();
    }

    return scores && typeof scores === 'object' && 'scores' in scores
      ? (scores as { scores: T[] }).scores
      : undefined;
  }
}

export default DB;
