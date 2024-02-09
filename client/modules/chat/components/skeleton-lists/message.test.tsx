import React from "react"
import MessageListSkeleton from "@/modules/chat/components/skeleton-lists/message"
import { render, screen } from "@testing-library/react"

/**
 * chat MessageListSkeleton  test
 *
 * @group unit
 */
describe("MessageListSkeleton", () => {
  it("renders the correct number of skeletons", () => {
    render(<MessageListSkeleton />)

    const skeletonCards = screen.getAllByTestId("skeleton-card")
    expect(skeletonCards).toHaveLength(15) // Adjust the number based on your component logic
  })
})
