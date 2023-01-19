module.exports = {
  setupFiles: [
    '<rootDir>/tests/dotenv-config.js'
  ],
  preset: 'ts-jest',
  roots: ['<rootDir>'],
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/*.test.ts'],
  silent: false,
  collectCoverageFrom: [
    'main/*.ts',
    '!main/errors.ts'
  ]
}
