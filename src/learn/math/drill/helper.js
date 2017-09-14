// A collection of helper functions

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const operations = ['+', '-', 'x', '\u00F7'];

const special1 = [...Array(9).keys()].map(a => [0, a + 1]);
const special2 = [...Array(9).keys()].map(a => [a + 1, 0]);
const special3 = [...Array(10).keys()].map(a => [a + 1, 0]);
const special4 = [...Array(18).keys()].map(a => [a + 1, a + 1]);
const special5 = [...Array(9).keys()].map(a => [1, a + 1]);
const special6 = [...Array(9).keys()].map(a => [a + 1, 1]); // [1...9, 1]
const special7 = [...Array(9).keys()].map(a => [a + 1, a + 1]); // [[1,1],...[9,9]]

const special8 = [...Array(8).keys()].map(a => a + 1) // [2...9]
  .reduce((acc, denominator) => {
    let numerator = denominator - 1;
    while (numerator > 0) {
      acc.push([numerator, denominator]);
      numerator -= 1;
    }
    return acc;
  }, []); // [[1,2],[1,3],[2,3]...]

const levelOps = [
  // Addition +
  [
    [[1, 2], [2, 1], [1, 3], [3, 1]], // A
    [[1, 4], [4, 1], [1, 1]], // B
    [[1, 5], [5, 1], [2, 2]], // C
    [[1, 6], [6, 1], [3, 3]], // D
    [[1, 7], [7, 1], [4, 4]], // E
    [[1, 8], [8, 1], [5, 5]], // F
    [[1, 9], [9, 1], ...special1, ...special2], // G
    [[2, 3], [3, 2], [6, 6]], // H
    [[4, 2], [2, 4], [7, 7]], // I
    [[5, 2], [2, 5], [8, 8]], // J
    [[6, 2], [2, 6], [9, 9]], // K
    [[7, 2], [2, 7], [4, 7], [7, 4]], // L
    [[8, 2], [2, 8], [8, 6], [6, 8]], // M
    [[9, 2], [2, 9], [9, 6], [6, 9]], // N
    [[4, 3], [3, 4], [6, 7], [7, 6]], // O
    [[5, 3], [3, 5], [7, 8], [8, 7]], // P
    [[5, 8], [8, 5], [7, 9], [9, 7]], // Q
    [[6, 3], [3, 6], [5, 9], [9, 5]], // R
    [[7, 3], [3, 7], [8, 9], [9, 8]], // S
    [[8, 3], [3, 8], [4, 9], [9, 4]], // T
    [[9, 3], [3, 9], [5, 7], [7, 5]], // U
    [[4, 5], [5, 4], [4, 8], [8, 4]], // V
    [[4, 6], [6, 4], [5, 6], [6, 5]], // W
    [], // X
    [], // Y
    [], // Z
  ],
  // Subtraction -
  [
    [[3, 2], [3, 1], [4, 3], [4, 1]], // A
    [[5, 4], [5, 1], [2, 1]], // B
    [[6, 1], [6, 5], [4, 2]], // C
    [[7, 1], [7, 6], [6, 3]], // D
    [[8, 1], [8, 7], [8, 4]], // E
    [[9, 1], [9, 8], [10, 5]], // F
    [[10, 1], [10, 9], ...special3], // G
    [[5, 3], [5, 2], [12, 6]], // H
    [[6, 2], [6, 4], [14, 7]], // I
    [[7, 2], [7, 5], [16, 8]], // J
    [[8, 2], [8, 6], [18, 9]], // K
    [[9, 2], [9, 7], [11, 7], [11, 4]], // L
    special4, // M
    [[10, 2], [10, 8], [14, 8], [14, 6]], // N
    [[11, 2], [11, 9], [15, 9], [15, 6]], // O
    [[7, 3], [7, 4], [13, 7], [13, 6]], // P
    [[8, 3], [8, 5], [15, 8], [15, 7]], // Q
    [[13, 8], [13, 5], [16, 9], [16, 7]], // R
    [[9, 3], [9, 6], [14, 9], [14, 5]], // S
    [[10, 3], [10, 7], [17, 9], [17, 8]], // T
    [[11, 3], [11, 8], [13, 9], [13, 4]], // U
    [[12, 3], [12, 9], [12, 7], [12, 5]], // V
    [[9, 5], [9, 4], [12, 8], [12, 4]], // W
    [[10, 6], [10, 4], [11, 6], [11, 5]], // X
    [], // Y
    [], // Z
  ],
  // Multiplication x
  [
    [...special5, ...special6], // A
    [...special1, ...special2], // B
    [[2, 3], [3, 2], [2, 2]], // C
    [[2, 4], [4, 2], [2, 5], [5, 2]], // D
    [[6, 2], [2, 6], [7, 2], [2, 7]], // E
    [[8, 2], [2, 8], [9, 2], [2, 9]], // F
    [[9, 3], [3, 9], [9, 4], [4, 9]], // G
    [[9, 5], [5, 9], [3, 3]], // H
    [[9, 6], [6, 9], [4, 4]], // I
    [[9, 7], [7, 9], [5, 5]], // J
    [[9, 8], [8, 9], [6, 6]], // K
    [[3, 4], [4, 3], [7, 7]], // L
    [[3, 5], [5, 3], [8, 8]], // M
    [[3, 6], [6, 3], [9, 9]], // N
    [[3, 7], [7, 3], [3, 8], [8, 3]], // O
    [[7, 8], [8, 7], [6, 8], [8, 6]], // P
    [[5, 8], [8, 5], [4, 8], [8, 4]], // Q
    [[7, 6], [6, 7], [7, 5], [5, 7]], // R
    [[7, 4], [4, 7], [6, 5], [5, 6]], // S
    [[5, 4], [4, 5], [4, 6], [6, 4]], // T
    [], // U
    [], // V
    [], // W
    [], // X
    [], // Y
    [], // Z
  ],
  // Division /
  [
    special6, // A
    special7, // B
    [[6, 2], [6, 3], [4, 2]], // C
    [[8, 2], [8, 4], [10, 2], [10, 5]], // D
    [[12, 2], [12, 6], [14, 2], [14, 7]], // E
    [[16, 2], [16, 8], [18, 2], [18, 9]], // F
    special8, // G
    [[27, 9], [27, 3], [36, 9], [36, 4]], // H
    [[45, 9], [45, 5], [9, 3]], // I
    [[54, 9], [54, 6], [16, 4]], // J
    [[63, 9], [63, 7], [25, 5]], // K
    [[72, 9], [72, 8], [36, 6]], // L
    [[12, 3], [12, 4], [49, 7]], // M
    [[15, 3], [15, 5], [64, 8]], // N
    [[18, 3], [18, 6], [81, 9]], // O
    [[21, 3], [21, 7], [24, 3], [24, 8]], // P
    [[56, 8], [56, 7], [48, 8], [48, 6]], // Q
    [[40, 8], [40, 5], [32, 8], [32, 4]], // R
    [[42, 7], [42, 6], [35, 7], [35, 5]], // S
    [[28, 7], [28, 4], [30, 6], [30, 5]], // T
    [[20, 4], [20, 5], [24, 6], [24, 4]], // U
    [], // V
    [], // W
    [], // X
    [], // Y
    [], // Z
  ],

];


function calculateAnswer([left, right], opIndex) {
  switch (opIndex) {
    case 0:
      return left + right;
    case 1:
      return left - right;
    case 2:
      return left * right;
    case 3:
      // When numerator is greater than denominator we're going to treat
      // it as a zero
      return Math.floor(left / right);
    default:
      return 0;
  }
}

/**
 * 
 * @param {number} levelIndex - 0 through 25 - each letter of the alphabet
 * @param {number[]} opIndexes - An array of 0 through 3 - operators +, -, *, /
 */
function getLowerUpper(levelIndexParam, opIndexes) {
  // Pick a random value from the opIndexes array
  const opIndex = opIndexes[Math.floor(Math.random() * opIndexes.length)];

  // Pick a collection of levels based on the opIndex
  const levels = levelOps[opIndex].filter(level => !!level.length);
  // Some of the last few levels are intentionally empty because it's just a repeat of
  // the final level that has values.
  const levelIndex = Math.min(levels.length, levelIndexParam);
  // Put all the levels up to levelIndex into an array except put the same number of each
  // level as the ordinal number of the level. This will gradually weight the higher levels
  // so pairs from those levels will come up more often.
  // e.g.
  // level = 0, [0]
  // level = 1: [0, 1, 1]
  // level = 2: [0, 1, 1, 2, 2, 2]
  const weightedLevels = [...Array(levelIndex + 1).keys()].reduce((acc, level) =>
    acc.concat([...Array(level + 1).keys()].map(() => level)), []);

  // Pick a random value from the array
  const levelElement = weightedLevels[Math.floor(Math.random() * weightedLevels.length)];
  // Get the array of pairs for that level
  const level = levels[levelElement];
  // Pick a random pair from the array
  const pair = level[Math.floor(Math.random() * level.length)];

  return [...pair, opIndex, calculateAnswer(pair, opIndex)];
}

module.exports = {
  alphabet,
  calculateAnswer,
  getLowerUpper,
  operations,
};
