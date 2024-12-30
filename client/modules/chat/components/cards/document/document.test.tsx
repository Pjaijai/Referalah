/**
 * DocumentCard component test
 *
 * @group unit
 */

import React from "react"
import DocumentCard from "@/modules/chat/components/cards/document/document"
import { render, screen } from "@testing-library/react"

// Mock the internationalization hook
jest.mock("@/utils/services/internationalization/client", () => ({
  useI18n: () => (key: string) => key,
}))

describe("DocumentCard", () => {
  const mockProps = {
    url: "https://example.com/document.pdf",
    documentName: "Test Document.pdf",
    documentSize: 1024000, // 1024 KB
    sentByUser: false,
    isDocumentExpired: false,
  }

  it("renders correctly for a non-expired document", () => {
    render(<DocumentCard {...mockProps} />)

    expect(screen.getByText("Test Document.pdf")).toBeInTheDocument()
    expect(screen.getByText("1024.0 kb")).toBeInTheDocument()
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://example.com/document.pdf"
    )
  })

  it("renders correctly for an expired document", () => {
    render(<DocumentCard {...mockProps} isDocumentExpired={true} />)

    expect(screen.getByText("Test Document.pdf")).toBeInTheDocument()
    expect(screen.getByText("1024.0 kb")).toBeInTheDocument()
    expect(screen.getByText("(general.expired)")).toBeInTheDocument()
    expect(screen.queryByRole("link")).not.toBeInTheDocument()
  })

  it("applies correct styles for user-sent documents", () => {
    const { container } = render(
      <DocumentCard {...mockProps} sentByUser={true} />
    )
    expect(container.firstChild).toHaveClass("bg-teal-100")
  })

  it("applies correct styles for received documents", () => {
    const { container } = render(
      <DocumentCard {...mockProps} sentByUser={false} />
    )
    expect(container.firstChild).toHaveClass("bg-slate-200")
  })

  it("formats file size correctly", () => {
    render(<DocumentCard {...mockProps} documentSize={2048} />)
    expect(screen.getByText("2.0 kb")).toBeInTheDocument()
  })

  it("renders file icon", () => {
    render(<DocumentCard {...mockProps} />)
    expect(screen.getByTestId("file-icon")).toBeInTheDocument()
  })
})
