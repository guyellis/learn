import type { DrillOptions } from '../math/drill/types.js';

export const ALPHABET: readonly string[] = Object.freeze('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
export const BADGE_BOUNDARIES: readonly number[] = Object.freeze([0, 2, 3, 4]); // Seconds per question boundaries for badges
export const COLOR_HTML: readonly string[] = Object.freeze([
  '#ffd700',
  '#c0c0c0',
  '#8C7853',
  'lightblue',
]);
export const COLOR_TEXT: readonly string[] = Object.freeze(['Gold', 'Silver', 'Bronze', 'Blue']);
export const DEFAULT_OPTIONS: DrillOptions = {
  largeKeyboard: false,
  levelIndex: 0, // A
  minutes: '10',
  onscreenKeyboard: false,
  opIndexes: [0], // +
  totalProblems: '20',
  userName: '',
};
export const MATH_DRILL_OPTIONS = 'mathDrillOptions';
export const MATH_DRILL_SCORES = 'mathDrillScores';
export const OPERATION_NAMES: readonly string[] = Object.freeze([
  'Addition',
  'Subtraction',
  'Multiplication',
  'Division',
]);
export const OPERATIONS: readonly string[] = Object.freeze(['+', '-', 'x', '\u00F7']);
export const RECORD_EQUAL = 'RECORD_EQUAL';
export const RECORD_MISS = 'RECORD_MISS';
export const RECORD_NEW = 'RECORD_NEW';
export const RECORD_NOT_EXIST = 'RECORD_NOT_EXIST';

const constants = {
  ALPHABET,
  BADGE_BOUNDARIES,
  COLOR_HTML,
  COLOR_TEXT,
  DEFAULT_OPTIONS,
  MATH_DRILL_OPTIONS,
  MATH_DRILL_SCORES,
  OPERATION_NAMES,
  OPERATIONS,
  RECORD_EQUAL,
  RECORD_MISS,
  RECORD_NEW,
  RECORD_NOT_EXIST,
};

export default constants;
