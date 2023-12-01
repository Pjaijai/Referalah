import { formatCreatedAt } from "@/utils/common/helpers/format/created-at"

/**
 * formatCreatedAt helper test
 *
 * @group unit
 */

describe("formatCreatedAt", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("returns formatted date for today with isExact true", () => {
    const result = formatCreatedAt("2023-12-01")
    expect(result.formattedDate).toBe("今日")
    expect(result.isExact).toBe(true)
  })

  it("returns formatted date for the last 5 days with isExact false", () => {
    const result = formatCreatedAt("2023-11-26")
    expect(result.formattedDate).toBe("5日")
    expect(result.isExact).toBe(false)
  })

  it("returns formatted date for a date older than 30 days with isExact true", () => {
    const result = formatCreatedAt("2023-10-31")
    expect(result.formattedDate).toBe("2023年10月31日") // Change this based on your formatDate implementation
    expect(result.isExact).toBe(true)
  })

  it("returns '--' for empty input", () => {
    const result = formatCreatedAt()
    expect(result.formattedDate).toBe("--")
  })
})
