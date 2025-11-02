module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/scraper/**'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(node-fetch)/)'
  ],
  moduleNameMapper: {
    '^node-fetch$': '<rootDir>/node_modules/node-fetch/src/index.js'
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    'tests/scraper.test.ts'  // Skip scraper tests for now due to ESM issues
  ]
};
