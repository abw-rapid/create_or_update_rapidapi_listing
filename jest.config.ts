import type { Config } from "@jest/types"

const config: Config.InitialOptions = {
  setupFiles: [
    '<rootDir>/tests/dotenv-config.js'
  ],
  preset: 'ts-jest',
  roots: ['<rootDir>'],
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/*.test.ts'],
  silent: false,
  collectCoverageFrom: [
    'src/*.ts',
    '!src/errors.ts'
  ]
}

export default config