/**
 * ConversationCard component test
 *
 * @group unit
 */

import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ConversationCard from "@/modules/chat/components/cards/conversation/conversation"
import { useI18n } from "@/utils/services/internationalization/client"
import { useQueryClient } from "@tanstack/react-query"
import { fireEvent, render, screen } from "@testing-library/react"

import useUpdateConversation from "@/hooks/api/message/update-conversation"
import useCreatedAt from "@/hooks/common/created-at"
import useUserStore from "@/hooks/state/user/store"

// Mock the hooks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}))
jest.mock("@/utils/services/internationalization/client", () => ({
  useI18n: jest.fn(),
}))
jest.mock("@tanstack/react-query", () => ({
  useQueryClient: jest.fn(),
}))
jest.mock("@/hooks/api/message/update-conversation", () => ({
  __esModule: true,
  default: jest.fn(),
}))
jest.mock("@/hooks/common/created-at", () => ({
  __esModule: true,
  default: jest.fn(),
}))
jest.mock("@/hooks/state/user/store", () => ({
  __esModule: true,
  default: jest.fn(),
}))

describe("ConversationCard", () => {
  const mockProps = {
    username: "Test User",
    text: "Hello, this is a test message",
    isSeen: false,
    avatarUrl: "https://example.com/avatar.jpg",
    updatedAt: "2023-01-01T00:00:00Z",
    uuid: "123",
    type: "sender" as const,
    acceptRequest: true,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: jest.fn() })
    ;(useSearchParams as jest.Mock).mockReturnValue({ get: jest.fn() })
    ;(useI18n as jest.Mock).mockReturnValue((key: string) => key)
    ;(useQueryClient as jest.Mock).mockReturnValue({
      invalidateQueries: jest.fn(),
    })
    ;(useUpdateConversation as jest.Mock).mockReturnValue({ mutate: jest.fn() })
    ;(useCreatedAt as jest.Mock).mockReturnValue({ data: "1 hour ago" })
    // @ts-ignore
    ;(useUserStore as jest.Mock).mockImplementation(() => ({
      uuid: "user123",
    }))
  })

  it("renders correctly", () => {
    render(<ConversationCard {...mockProps} />)
    expect(screen.getByText("Test User")).toBeInTheDocument()
    expect(screen.getByText("Hello, this is a test mes")).toBeInTheDocument()
    expect(screen.getByText("1 hour ago")).toBeInTheDocument()
  })

  it("truncates long messages", () => {
    const longMessage = "This is a very long message that should be truncated"
    render(<ConversationCard {...mockProps} text={longMessage} />)
    expect(screen.getByText("This is a very long messa")).toBeInTheDocument()
  })

  it("shows conversation request message when not accepted", () => {
    render(<ConversationCard {...mockProps} acceptRequest={false} />)
    expect(screen.getByText("chat.conversation_request")).toBeInTheDocument()
  })

  it("shows unread indicator when message is not seen", () => {
    render(<ConversationCard {...mockProps} />)
    expect(screen.getByTestId("unread-big-dot")).toBeInTheDocument()
  })

  it("updates conversation and navigates when clicked", () => {
    const mockUpdate = jest.fn()
    ;(useUpdateConversation as jest.Mock).mockReturnValue({
      mutate: mockUpdate,
    })
    const mockPush = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })

    render(<ConversationCard {...mockProps} />)
    fireEvent.click(screen.getByText("Test User"))

    expect(mockUpdate).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalled()
  })

  it("handles document name when text is null", () => {
    render(
      <ConversationCard
        {...mockProps}
        text={null}
        documentName="document.pdf"
      />
    )
    expect(screen.getByText("document.pdf")).toBeInTheDocument()
  })
})
