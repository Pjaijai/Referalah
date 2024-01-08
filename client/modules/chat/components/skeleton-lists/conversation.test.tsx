import React from "react"
import ConversationListSkeleton from "@/modules/chat/components/skeleton-lists/conversation"
import { render, screen } from "@testing-library/react"

/**
 * chat ConversationListSkeleton  test
 *
 * @group unit
 */

describe("ConversationListSkeleton", () => {
  it("renders the correct number of skeletons", () => {
    render(<ConversationListSkeleton />)

    const skeletonCards = screen.getAllByTestId("skeleton-card")
    expect(skeletonCards).toHaveLength(10) // Adjust the number based on your component logic
  })

  it("renders skeletons with the correct styles", () => {
    render(<ConversationListSkeleton />)

    const skeletonCards = screen.getAllByTestId("skeleton-card")

    skeletonCards.forEach((skeleton) => {
      expect(skeleton).toHaveClass("rounded-sm md:h-20")
    })
  })
})
