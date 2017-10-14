
module.exports = {
  RECORD_NEW: 'RECORD_NEW',
  RECORD_EQUAL: 'RECORD_EQUAL',
  RECORD_MISS: 'RECORD_MISS',
  RECORD_NOT_EXIST: 'RECORD_NOT_EXIST',
  COLOR_TEXT: Object.freeze(['Gold', 'Silver', 'Bronze', 'Blue']),
  COLOR_HTML: Object.freeze(['#ffd700', '#c0c0c0', '#8C7853', 'lightblue']),
  BADGE_BOUNDARIES: Object.freeze([0, 2, 3, 4]), // Seconds per question boundaries for badges
  ALPHABET: Object.freeze('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')),
  OPERATIONS: Object.freeze(['+', '-', 'x', '\u00F7']),
  OPERATION_NAMES: Object.freeze(['Addition', 'Subtraction', 'Multiplication', 'Division']),
  MATH_DRILL_OPTIONS: 'mathDrillOptions',
  MATH_DRILL_SCORES: 'mathDrillScores',
};
