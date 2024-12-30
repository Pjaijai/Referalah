/**
 * MessageList component test
 *
 * @group unit
 */

import React from "react"
import MessageList from "@/modules/chat/components/lists/message/message"
import { supabase } from "@/utils/services/supabase/config"
import { render, screen, waitFor } from "@testing-library/react"

import useGetMessageListByConversationUuid from "@/hooks/api/message/get-message-list-by-conversation-uuid"
import useUserStore from "@/hooks/state/user/store"

// Mock the hooks and components
jest.mock("@/hooks/api/message/get-message-list-by-conversation-uuid")
jest.mock("@/hooks/state/user/store")
jest.mock("@/utils/services/supabase/config", () => ({
  supabase: {
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn(),
    })),
    removeChannel: jest.fn(),
  },
}))
jest.mock("@/modules/chat/components/cards/message/message", () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => (
    <div data-testid="message-card">{text}</div>
  ),
}))
jest.mock("@/components/customized-ui/Infinite-scroll/base", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="infinite-scroll">{children}</div>
  ),
}))

describe("MessageList", () => {
  const mockConversationUuid = "conv123"
  const mockUserUuid = "user123"
  const mockLastMessage = {
    sentByUser: true,
    body: "Last message",
    createdAt: "2023-01-01T00:00:00Z",
  }
  const mockMessages = [
    {
      uuid: "msg1",
      body: "Hello",
      sender_uuid: "user123",
      created_at: "2023-01-01T00:00:00Z",
    },
    {
      uuid: "msg2",
      body: "Hi",
      sender_uuid: "user456",
      created_at: "2023-01-01T00:01:00Z",
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    // @ts-ignore
    ;(useUserStore as jest.Mock).mockReturnValue(mockUserUuid)
    ;(useGetMessageListByConversationUuid as jest.Mock).mockReturnValue({
      data: { pages: [mockMessages] },
      isLoading: false,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    })
  })

  it("renders message cards when data is available", async () => {
    render(
      <MessageList
        conversationUuid={mockConversationUuid}
        lastMessage={mockLastMessage}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId("infinite-scroll")).toBeInTheDocument()
      expect(screen.getByText("Hello")).toBeInTheDocument()
      expect(screen.getByText("Hi")).toBeInTheDocument()
    })
  })

  it("renders loading skeleton when isLoading is true", () => {
    ;(useGetMessageListByConversationUuid as jest.Mock).mockReturnValue({
      isLoading: true,
    })

    render(
      <MessageList
        conversationUuid={mockConversationUuid}
        lastMessage={mockLastMessage}
      />
    )

    expect(screen.getByTestId("message-card")).toBeInTheDocument()
  })

  it("renders last message when loading", () => {
    ;(useGetMessageListByConversationUuid as jest.Mock).mockReturnValue({
      isLoading: true,
    })

    render(
      <MessageList
        conversationUuid={mockConversationUuid}
        lastMessage={mockLastMessage}
      />
    )

    expect(screen.getByText("Last message")).toBeInTheDocument()
  })

  it("sets up and cleans up Supabase channel subscription", () => {
    const mockChannel = {
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn(),
    }
    ;(supabase.channel as jest.Mock).mockReturnValue(mockChannel)

    const { unmount } = render(
      <MessageList
        conversationUuid={mockConversationUuid}
        lastMessage={mockLastMessage}
      />
    )

    expect(supabase.channel).toHaveBeenCalledWith(
      `message-${mockConversationUuid}`
    )
    expect(mockChannel.on).toHaveBeenCalled()
    expect(mockChannel.subscribe).toHaveBeenCalled()

    unmount()

    expect(supabase.removeChannel).toHaveBeenCalled()
  })
})
