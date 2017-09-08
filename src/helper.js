// A collection of helper functions

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const operations = ['+', '-', 'x', '/'];

const special1 = [...Array(9).keys()].map(a => [0, a + 1]);
const special2 = [...Array(9).keys()].map(a => [a + 1, 0]);
const levelOps = [[
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
]];


function calculateAnswer([left, right], opIndex) {
  switch (opIndex) {
    case 0:
      return left + right;
    case 1:
      return left - right;
    case 2:
      return left * right;
    case 3:
      return left / right;
    default:
      return 0;
  }
}

/**
 * 
 * @param {number} levelIndex - 0 through 25 - each letter of the alphabet
 * @param {number} opIndex - 0 through 3 - operators +, -, *, /
 */
function getLowerUpper(levelIndex, opIndex) {
  // Pick a collection of levels based on the opIndex
  const levels = levelOps[opIndex];
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
