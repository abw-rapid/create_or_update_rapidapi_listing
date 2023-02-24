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
    'tests/*.ts',
    'src/*.ts',
    '!src/errors.ts',
    '!src/index.ts',
    '!src/types.ts'
  ],
  transform: {
    '^.+\\.[t]s?$': [
    'ts-jest',
      {
      diagnostics: {
        ignoreCodes: [151001]
      },
      },
    ],
  },

}

export default config