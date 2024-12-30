/**
 * fileTypeMapper constant test
 *
 * @group unit
 */

import fileTypeMapper from "@/utils/common/mappers/file-type"

describe("fileTypeMapper", () => {
  it("maps image/jpg to jpg", () => {
    expect(fileTypeMapper["image/jpg"]).toBe("jpg")
  })

  it("maps image/jpeg to jpeg", () => {
    expect(fileTypeMapper["image/jpeg"]).toBe("jpeg")
  })

  it("maps image/png to png", () => {
    expect(fileTypeMapper["image/png"]).toBe("png")
  })

  it("maps application/pdf to pdf", () => {
    expect(fileTypeMapper["application/pdf"]).toBe("pdf")
  })

  it("returns undefined for unmapped MIME types", () => {
    expect(fileTypeMapper["application/json"]).toBeUndefined()
  })

  it("is case-sensitive for MIME types", () => {
    expect(fileTypeMapper["IMAGE/PNG"]).toBeUndefined()
  })

  it("contains the correct number of mappings", () => {
    const mappingCount = Object.keys(fileTypeMapper).length
    expect(mappingCount).toBe(4)
  })

  it("does not contain empty string values", () => {
    const hasEmptyString = Object.values(fileTypeMapper).some(
      (value) => value === ""
    )
    expect(hasEmptyString).toBe(false)
  })
})
