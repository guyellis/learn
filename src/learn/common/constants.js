const DEFAULT_OPTIONS = {
  largeKeyboard: false,
  levelIndex: 0, // A
  minutes: '10',
  onscreenKeyboard: false,
  opIndexes: [0], // +
  totalProblems: '20',
  userName: '',
};

module.exports = {
  ALPHABET: Object.freeze('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')),
  BADGE_BOUNDARIES: Object.freeze([0, 2, 3, 4]), // Seconds per question boundaries for badges
  COLOR_HTML: Object.freeze(['#fbc02d', '#9e9e9e', '#8d6e63', '#81d4fa']),
  COLOR_TEXT: Object.freeze(['Gold', 'Silver', 'Bronze', 'Blue']),
  DEFAULT_OPTIONS,
  MATH_DRILL_OPTIONS: 'mathDrillOptions',
  MATH_DRILL_SCORES: 'mathDrillScores',
  OPERATION_NAMES: Object.freeze(['Addition', 'Subtraction', 'Multiplication', 'Division']),
  OPERATIONS: Object.freeze(['+', '-', 'x', '\u00F7']),
  RECORD_EQUAL: 'RECORD_EQUAL',
  RECORD_MISS: 'RECORD_MISS',
  RECORD_NEW: 'RECORD_NEW',
  RECORD_NOT_EXIST: 'RECORD_NOT_EXIST',
};
