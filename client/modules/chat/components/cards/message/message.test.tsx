/**
 * MessageCard component test
 *
 * @group unit
 */

import React from "react"
import MessageCard from "@/modules/chat/components/cards/message/message"
import { render, screen } from "@testing-library/react"

// Mock the hooks and components
jest.mock("@/hooks/common/created-at", () => ({
  __esModule: true,
  default: () => ({ data: "2023-01-01 12:00" }),
}))

jest.mock("@/modules/chat/components/cards/document/document", () => ({
  __esModule: true,
  default: ({ documentName }: { documentName: string }) => (
    <div data-testid="document-card">{documentName}</div>
  ),
}))

describe("MessageCard", () => {
  const mockProps = {
    text: "Hello, this is a test message",
    sentByUser: false,
    createdAt: "2023-01-01T12:00:00Z",
    isDocumentExpired: false,
  }

  it("renders correctly for received message", () => {
    render(<MessageCard {...mockProps} />)

    expect(screen.getByTestId("message-card")).toHaveClass("bg-slate-50")
    expect(
      screen.getByText("Hello, this is a test message")
    ).toBeInTheDocument()
    expect(screen.getByText("2023-01-01 12:00")).toBeInTheDocument()
  })

  it("renders correctly for sent message", () => {
    render(<MessageCard {...mockProps} sentByUser={true} />)

    expect(screen.getByTestId("message-card")).toHaveClass("bg-green-300")
    expect(
      screen.getByText("Hello, this is a test message")
    ).toBeInTheDocument()
    expect(screen.getByText("2023-01-01 12:00")).toBeInTheDocument()
  })

  it("renders links correctly", () => {
    const propsWithLink = {
      ...mockProps,
      text: "Check out this link: https://example.com",
    }
    render(<MessageCard {...propsWithLink} />)

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "https://example.com")
    expect(link).toHaveAttribute("target", "_blank")
  })

  it("renders DocumentCard when document is provided", () => {
    const propsWithDocument = {
      ...mockProps,
      document: {
        name: "test.pdf",
        size: 1024,
        path: "https://example.com/test.pdf",
      },
    }
    render(<MessageCard {...propsWithDocument} />)

    expect(screen.getByTestId("document-card")).toBeInTheDocument()
    expect(screen.getByText("test.pdf")).toBeInTheDocument()
  })

  it("does not render DocumentCard when document is not provided", () => {
    render(<MessageCard {...mockProps} />)

    expect(screen.queryByTestId("document-card")).not.toBeInTheDocument()
  })

  it("handles null text correctly", () => {
    render(<MessageCard {...mockProps} text={null} />)

    expect(screen.queryByText("null")).not.toBeInTheDocument()
  })
})
