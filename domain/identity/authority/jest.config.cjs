/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  moduleNameMapper: {
    '^@application/(.*)$': '<rootDir>/src/authority/application/$1',
    '^@domain/(.*)$': '<rootDir>/src/authority/domain/$1',
    '^@infra/(.*)$': '<rootDir>/src/authority/infra/$1',
    '^@interface/(.*)$': '<rootDir>/src/authority/interface/$1'
  }
}
