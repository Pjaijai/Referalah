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
  default: ({
    documentName,
    isDocumentExpired,
  }: {
    documentName: string
    isDocumentExpired: boolean
  }) => (
    <div data-testid="document-card">
      {documentName}
      {isDocumentExpired && <span>Expired</span>}
    </div>
  ),
}))

describe("MessageCard", () => {
  const mockProps = {
    text: "Hello, this is a test message",
    sentByUser: false,
    createdAt: "2023-01-01T12:00:00Z",
    isDocumentExpired: false,
  }

  it("renders message text correctly", () => {
    render(<MessageCard {...mockProps} />)
    expect(
      screen.getByText("Hello, this is a test message")
    ).toBeInTheDocument()
  })

  it("renders timestamp correctly", () => {
    render(<MessageCard {...mockProps} />)
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

  it("renders multiple links correctly", () => {
    const propsWithMultipleLinks = {
      ...mockProps,
      text: "Check these: https://example1.com and https://example2.com",
    }
    render(<MessageCard {...propsWithMultipleLinks} />)

    const links = screen.getAllByRole("link")
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveAttribute("href", "https://example1.com")
    expect(links[1]).toHaveAttribute("href", "https://example2.com")
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

  it("renders expired document correctly", () => {
    const propsWithExpiredDocument = {
      ...mockProps,
      document: {
        name: "expired.pdf",
        size: 1024,
        path: "https://example.com/expired.pdf",
      },
      isDocumentExpired: true,
    }
    render(<MessageCard {...propsWithExpiredDocument} />)

    expect(screen.getByTestId("document-card")).toBeInTheDocument()
    expect(screen.getByText("expired.pdf")).toBeInTheDocument()
    expect(screen.getByText("Expired")).toBeInTheDocument()
  })

  it("handles long messages correctly", () => {
    const longMessage = "A".repeat(1000)
    render(<MessageCard {...mockProps} text={longMessage} />)
    expect(screen.getByText(longMessage)).toBeInTheDocument()
  })

  it("handles messages with special characters", () => {
    const specialChars = "!@#$%^&*()_+{}|:<>?~"
    render(<MessageCard {...mockProps} text={specialChars} />)
    expect(screen.getByText(specialChars)).toBeInTheDocument()
  })
})
