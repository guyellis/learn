module.exports = {
  verbose: true,
  collectCoverageFrom: [
    '!**/.vscode/**',
    '!**/coverage/**',
    '!**/jest.config.js',
    '!**/node_modules/**',
    '!**/postcss.config.js',
    '!**/public/**',
    '!**/src/tester.jsx',
    '!**/test/**',
    '!**/webpack**',
    '**/*.{js,jsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 1,
      functions: 1,
      lines: 1,
      statements: 1,
    },
  },
};
