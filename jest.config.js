module.exports = {
  moduleNameMapper: {
    '~(.*)': '<rootDir>/src$1',
  },
  moduleDirectories: ['node_modules', 'src'],
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  transform: {
    '^.+\\.[tj]s$': 'babel-jest',
  },
  preset: 'ts-jest',
  verbose: true,
};
