import React from "react"
import ContributionAreaBadge from "@/modules/contributors/components/contribution-area-badge"
import { ContributedArea } from "@/modules/contributors/types/contributed-area"
import { render, screen, waitFor } from "@testing-library/react"

/**
 * ContributionAreaBadge test
 *
 * @group unit
 */
describe("ContributionAreaBadge", () => {
  test("renders badge with correct text", async () => {
    const area: ContributedArea = "uiux_design"

    render(<ContributionAreaBadge area={area} />)

    await waitFor(() => {
      expect(screen.getByText("UX/UI設計")).toBeInTheDocument()
    })
  })
})
