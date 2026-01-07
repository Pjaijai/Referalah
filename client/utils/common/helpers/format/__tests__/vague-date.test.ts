/**
 * formatVagueDateHelper test
 *
 * @group unit
 */

import formatVagueDateHelper from "@/utils/common/helpers/format/vague-date"

import { ELocale } from "@/types/common/enums/locale"

describe("formatVagueDateHelper", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("with valid ISO string", () => {
    describe("en locale", () => {
      it("should return Early for days 1-10", () => {
        const result = formatVagueDateHelper(
          "2023-05-05T00:00:00Z",
          ELocale.EN_CA
        )
        expect(result).toBe("Early May 2023")
      })

      it("should return Mid for days 11-20", () => {
        const result = formatVagueDateHelper(
          "2023-05-15T00:00:00Z",
          ELocale.EN_CA
        )
        expect(result).toBe("Mid May 2023")
      })

      it("should return Late for days 21-31", () => {
        const result = formatVagueDateHelper(
          "2023-05-25T00:00:00Z",
          ELocale.EN_CA
        )
        expect(result).toBe("Late May 2023")
      })
    })

    describe("zh-hk locale", () => {
      it("should return 初 for days 1-10", () => {
        const result = formatVagueDateHelper(
          "2023-05-05T00:00:00Z",
          ELocale.ZH_HK
        )
        expect(result).toBe("2023年5月初")
      })

      it("should return 中 for days 11-20", () => {
        const result = formatVagueDateHelper(
          "2023-05-15T00:00:00Z",
          ELocale.ZH_HK
        )
        expect(result).toBe("2023年5月中")
      })

      it("should return 尾 for days 21-31", () => {
        const result = formatVagueDateHelper(
          "2023-05-25T00:00:00Z",
          ELocale.ZH_HK
        )
        expect(result).toBe("2023年5月尾")
      })
    })

    describe("zh-tw locale", () => {
      it("should return 初 for days 1-10", () => {
        const result = formatVagueDateHelper(
          "2023-05-05T00:00:00Z",
          ELocale.ZH_TW
        )
        expect(result).toBe("2023年5月初")
      })

      it("should return 中 for days 11-20", () => {
        const result = formatVagueDateHelper(
          "2023-05-15T00:00:00Z",
          ELocale.ZH_TW
        )
        expect(result).toBe("2023年5月中")
      })

      it("should return 尾 for days 21-31", () => {
        const result = formatVagueDateHelper(
          "2023-05-25T00:00:00Z",
          ELocale.ZH_TW
        )
        expect(result).toBe("2023年5月尾")
      })
    })
  })

  describe("with invalid ISO string", () => {
    it("should return Invalid Date", () => {
      const result = formatVagueDateHelper("invalid-date", ELocale.EN_CA)
      expect(result).toBe("Invalid Date")
    })
  })
})
