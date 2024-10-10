import compareDateDifferenceHelper from "@/utils/common/helpers/time/compare-date-difference"

/**
 * compareDateDifferenceHelper test
 *
 * @group unit
 */

describe("compareDateDifferenceHelper", () => {
  it("calculates difference in days correctly", () => {
    const result = compareDateDifferenceHelper({
      oldDate: "2023-10-01",
      newDate: "2023-10-05",
      unit: "day",
    })
    expect(result).toBe(4)
  })

  it("calculates difference in months correctly", () => {
    const result = compareDateDifferenceHelper({
      oldDate: "2023-01-15",
      newDate: "2023-04-15",
      unit: "month",
    })
    expect(result).toBe(3)
  })

  it("calculates difference in years correctly", () => {
    const result = compareDateDifferenceHelper({
      oldDate: "2020-05-01",
      newDate: "2023-05-01",
      unit: "year",
    })
    expect(result).toBe(3)
  })

  it("calculates difference in hours correctly", () => {
    const result = compareDateDifferenceHelper({
      oldDate: "2023-10-01T10:00:00",
      newDate: "2023-10-01T15:30:00",
      unit: "hour",
    })
    expect(result).toBe(5)
  })

  it("calculates difference in minutes correctly", () => {
    const result = compareDateDifferenceHelper({
      oldDate: "2023-10-01T10:00:00",
      newDate: "2023-10-01T10:45:00",
      unit: "minute",
    })
    expect(result).toBe(45)
  })

  it("handles negative differences correctly", () => {
    const result = compareDateDifferenceHelper({
      oldDate: "2023-10-05",
      newDate: "2023-10-01",
      unit: "day",
    })
    expect(result).toBe(-4)
  })

  it("returns 0 for same dates", () => {
    const result = compareDateDifferenceHelper({
      oldDate: "2023-10-01",
      newDate: "2023-10-01",
      unit: "day",
    })
    expect(result).toBe(0)
  })

  it("handles different date formats correctly", () => {
    const result = compareDateDifferenceHelper({
      oldDate: "01/01/2023",
      newDate: "12/31/2023",
      unit: "day",
    })
    expect(result).toBe(364)
  })
})
