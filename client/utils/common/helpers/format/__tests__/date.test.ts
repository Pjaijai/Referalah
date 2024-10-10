import { formatDate } from "@/utils/common/helpers/format/date"
import dayjs from "dayjs"

/**
 * formatDate helper test
 *
 * @group unit
 */

describe("formatDate", () => {
  it("formats date correctly with given format", () => {
    const date = "2023-10-15T12:30:45"
    const format = "YYYY-MM-DD"
    const result = formatDate(format, date)
    expect(result).toBe("2023-10-15")
  })

  it("returns '--' when date is null", () => {
    const format = "YYYY-MM-DD"
    const result = formatDate(format, null)
    expect(result).toBe("--")
  })

  it("returns '--' when date is undefined", () => {
    const format = "YYYY-MM-DD"
    const result = formatDate(format, undefined)
    expect(result).toBe("--")
  })

  it("formats date with time", () => {
    const date = "2023-10-15T12:30:45"
    const format = "YYYY-MM-DD HH:mm:ss"
    const result = formatDate(format, date)
    expect(result).toBe("2023-10-15 12:30:45")
  })

  it("formats date with custom format", () => {
    const date = "2023-10-15T12:30:45"
    const format = "DD/MM/YYYY"
    const result = formatDate(format, date)
    expect(result).toBe("15/10/2023")
  })

  it("handles different input date formats", () => {
    const date = "October 15, 2023"
    const format = "YYYY-MM-DD"
    const result = formatDate(format, date)
    expect(result).toBe("2023-10-15")
  })

  it("returns '--' for invalid date input", () => {
    const date = "Invalid Date"
    const format = "YYYY-MM-DD"
    const result = formatDate(format, date)
    expect(result).toBe("--")
  })
})
