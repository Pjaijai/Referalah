// import nextJest from "next/jest.js"

// const createJestConfig = nextJest({
//   // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
//   dir: "./",
// })

// // Add any custom config to be passed to Jest
// /** @type {import('jest').Config} */
// const config = {
//   // Add more setup options before each test is run
//   setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
//   runner: "groups",
//   testEnvironment: "jest-environment-jsdom",
// }

// // createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
// export default createJestConfig(config)

import path from "path"
import { fileURLToPath } from "url"
import nextJest from "next/jest.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const createJestConfig = nextJest({
  dir: "./",
})

/** @type {import('jest').Config} */
const config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  runner: "groups",
  testEnvironment: "jest-environment-jsdom",
  moduleDirectories: ["node_modules", "<rootDir>"],
  moduleNameMapper: {
    "^@/(.*)$": path.join(__dirname, "$1"),
  },
}

export default createJestConfig(config)
