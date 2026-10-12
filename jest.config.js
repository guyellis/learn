export default {
  verbose: true,
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/dist/'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-markdown|vfile|vfile-message|unist-.*|unified|bail|is-plain-obj|trough|remark-.*|mdast-util-.*|micromark.*|decode-named-character-reference|character-entities|property-information|hast-util-whitespace|space-separated-tokens|comma-separated-tokens|trim-lines|ccount|escape-string-regexp|markdown-table)/)',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/dev/**',
    '!src/index.jsx',
    '!src/tester.jsx',
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
  },
};
