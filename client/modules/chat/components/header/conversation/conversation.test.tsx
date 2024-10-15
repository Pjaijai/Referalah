/**
 * ConversationHeader component test
 *
 * @group unit
 */

import React from "react"
import { useRouter } from "next/navigation"
import ConversationHeader from "@/modules/chat/components/header/conversation/conversation"
import { fireEvent, render, screen } from "@testing-library/react"

// Mock the next/navigation hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

// Mock the BaseAvatar component
jest.mock("@/components/customized-ui/avatars/base", () => ({
  __esModule: true,
  default: ({ fallBack, alt }: any) => (
    <div data-testid="base-avatar">
      {fallBack}-{alt}
    </div>
  ),
}))

describe("ConversationHeader", () => {
  const mockProps = {
    username: "John Doe",
    jobTitle: "Software Engineer",
    companyName: "Tech Corp",
    avatarUrl: "https://example.com/avatar.jpg",
    uuid: "123-456",
  }

  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
  })

  it("renders correctly with all props", () => {
    render(<ConversationHeader {...mockProps} />)

    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("Software Engineer")).toBeInTheDocument()
    expect(screen.getByText("@Tech Corp")).toBeInTheDocument()
    expect(screen.getByTestId("base-avatar")).toHaveTextContent("J-John Doe")
  })

  it("renders correctly without optional props", () => {
    render(
      <ConversationHeader
        {...mockProps}
        jobTitle={null}
        companyName={null}
        avatarUrl={null}
      />
    )

    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.queryByText("Software Engineer")).not.toBeInTheDocument()
    expect(screen.queryByText("@Tech Corp")).not.toBeInTheDocument()
  })

  it("navigates back when back button is clicked", () => {
    render(<ConversationHeader {...mockProps} />)

    fireEvent.click(screen.getByTestId("chevron-left"))
    expect(mockPush).toHaveBeenCalledWith("/chat")
  })

  it("navigates to profile when avatar is clicked", () => {
    render(<ConversationHeader {...mockProps} />)

    fireEvent.click(screen.getByTestId("base-avatar"))
    expect(mockPush).toHaveBeenCalledWith("/profile/123-456")
  })
})
