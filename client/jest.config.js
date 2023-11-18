/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/$1",
  },
  collectCoverageFrom: ["**/*.{ts,tsx}", "!**/node_modules/**"],
  runner: "groups",
}
