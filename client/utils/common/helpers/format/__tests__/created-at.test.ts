import { formatCreatedAt } from "@/utils/common/helpers/format/created-at"

/**
 * formatCreatedAt helper test
 *
 * @group unit
 */
jest.useFakeTimers().setSystemTime(new Date("2023-12-02"))

describe("formatCreatedAt", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("returns formatted date for today with isExact true", () => {
    const result = formatCreatedAt("2023-12-02")
    expect(result.formattedDate).toBe("今日")
    expect(result.isExact).toBe(true)
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
