import { formatLocation } from "@/utils/common/helpers/format/location"

/**
 * formatLocation helper test
 *
 * @group unit
 */

describe("formatLocation", () => {
  it("formats location with city, province, and country", () => {
    const result = formatLocation("Tokyo", "Tokyo", "Japan")
    expect(result).toBe("Tokyo, Tokyo, Japan")
  })

  it("formats location with only city and country", () => {
    const result = formatLocation("New York", null, "USA")
    expect(result).toBe("New York, USA")
  })

  it("formats location with only province and country", () => {
    const result = formatLocation(null, "Ontario", "Canada")
    expect(result).toBe("Ontario, Canada")
  })

  it("formats location with only country", () => {
    const result = formatLocation(null, null, "Australia")
    expect(result).toBe("Australia")
  })

  it("returns an empty string for all null inputs", () => {
    const result = formatLocation(null, null, null)
    expect(result).toBe("")
  })
})
