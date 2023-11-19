import { ContributedArea } from "@/modules/contributors/types/contributed-area"
import getContributionAreaText from "@/modules/contributors/uilts/get-contribution-area-text"

/**
 * getContributionAreaText test
 *
 * @group unit
 */
describe("getContributionAreaText", () => {
  it("returns the correct text for each ContributedArea", () => {
    const softwareText = getContributionAreaText(
      "software_development" as ContributedArea
    )
    expect(softwareText).toBe("軟件開發")

    const uiuxText = getContributionAreaText("uiux_design" as ContributedArea)
    expect(uiuxText).toBe("UX/UI設計")

    const marketingText = getContributionAreaText(
      "marketing" as ContributedArea
    )
    expect(marketingText).toBe("市場推廣")

    const graphicDesignText = getContributionAreaText(
      "graphic_design" as ContributedArea
    )
    expect(graphicDesignText).toBe("平面設計")

    const administrationText = getContributionAreaText(
      "administration" as ContributedArea
    )
    expect(administrationText).toBe("行政工作")
  })

  it("returns undefined for unknown ContributedArea", () => {
    const unknownText = getContributionAreaText("unknown" as ContributedArea)
    expect(unknownText).toBeUndefined()
  })
})
