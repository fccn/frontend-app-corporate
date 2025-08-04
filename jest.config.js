const { createConfig } = require('@openedx/frontend-build');

module.exports = createConfig('jest', {
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTest.js',
  ],
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
  },
});
