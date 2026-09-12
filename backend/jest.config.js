export default {
  testEnvironment: "node",
  setupFiles: ["<rootDir>/src/tests/env.js"],
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.js"],
  testTimeout: 120000,
  collectCoverageFrom: ["src/**/*.js", "!src/tests/**"],
  coverageReporters: ["text", "lcov"],
};
