module.exports = {
  verbose: true,
  collectCoverageFrom: [
    '!**/.vscode/**',
    '!**/coverage/**',
    '!**/jest.config.js',
    '!**/node_modules/**',
    '!**/postcss.config.js',
    '!**/public/**',
    '!**/src/dev/**',
    '!**/src/index.jsx',
    '!**/src/tester.jsx',
    '!**/test/**',
    '!**/webpack**',
    '**/*.{js,jsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  setupTestFrameworkScriptFile: './test/_setup.js',
};
