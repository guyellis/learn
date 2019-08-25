module.exports = {
  verbose: true,
  testPathIgnorePatterns: ['/dist/'],
  collectCoverageFrom: [
    '!**/.vscode/**',
    '!**/coverage/**',
    '!**/dist/**',
    '!**/jest.config.js',
    '!**/node_modules/**',
    '!**/postcss.config.js',
    '!**/public/**',
    '!**/src/dev/**',
    '!**/src/assets/**',
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
  setupFilesAfterEnv: ['<rootDir>/test/_setup.js'],
  transform: {
    '.+\\.(j|t)sx?$': 'ts-jest',
    '^.+\\.svg$': '<rootDir>/test/svgTransform.js',
  },
};
