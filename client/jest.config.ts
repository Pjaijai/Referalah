import type { Config } from "jest"

const config: Config = {
  roots: ["<rootDir>"],
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/$1",
  },
  testEnvironment: "jsdom",
}

export default config
