import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"

import "@testing-library/jest-dom"
import LinkedInBadge from "./linkedin"

// Mock the Icons component
jest.mock("@/components/icons", () => ({
  Icons: {
    linkedin: jest.fn(({ className }) => (
      <span data-testid="linkedin-icon" className={className}>
        LinkedIn
      </span>
    )),
    loader: jest.fn(({ className }) => (
      <span data-testid="loader-icon" className={className}>
        Loading
      </span>
    )),
    cross: jest.fn(({ className }) => (
      <span data-testid="cross-icon" className={className}>
        X
      </span>
    )),
  },
}))

/**
 * LinkedInBadge component tests
 * @group unit
 */
describe("LinkedInBadge Component", () => {
  describe("Rendering", () => {
    it("should render the badge with LinkedIn icon", () => {
      render(<LinkedInBadge />)

      expect(screen.getByTestId("linkedin-icon")).toBeInTheDocument()
    })

    it("should render with default text 'LinkedIn Verified' when no name provided", () => {
      render(<LinkedInBadge />)

      expect(screen.getByText("LinkedIn Verified")).toBeInTheDocument()
    })

    it("should render with provided name in full variant", () => {
      render(<LinkedInBadge name="John Doe" variant="full" />)

      expect(screen.getByText("John Doe")).toBeInTheDocument()
    })

    it("should render 'Verified' text in simple variant", () => {
      render(<LinkedInBadge name="John Doe" variant="simple" />)

      expect(screen.getByText("Verified")).toBeInTheDocument()
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument()
    })

    it("should render profile picture when provided in full variant", () => {
      render(
        <LinkedInBadge
          name="John Doe"
          picture="https://example.com/pic.jpg"
          variant="full"
        />
      )

      const image = screen.getByAltText("LinkedIn Profile") as HTMLImageElement
      expect(image).toBeInTheDocument()
      expect(image.src).toBe("https://example.com/pic.jpg")
    })

    it("should not render profile picture in simple variant", () => {
      render(
        <LinkedInBadge
          name="John Doe"
          picture="https://example.com/pic.jpg"
          variant="simple"
        />
      )

      expect(screen.queryByAltText("LinkedIn Profile")).not.toBeInTheDocument()
    })

    it("should not render profile picture when not provided", () => {
      render(<LinkedInBadge name="John Doe" variant="full" />)

      expect(screen.queryByAltText("LinkedIn Profile")).not.toBeInTheDocument()
    })
  })

  describe("Variant Prop", () => {
    it("should default to full variant when variant not specified", () => {
      render(<LinkedInBadge name="John Doe" />)

      expect(screen.getByText("John Doe")).toBeInTheDocument()
    })

    it("should display name in full variant", () => {
      render(<LinkedInBadge name="Jane Smith" variant="full" />)

      expect(screen.getByText("Jane Smith")).toBeInTheDocument()
      expect(screen.queryByText("Verified")).not.toBeInTheDocument()
    })

    it("should display 'Verified' in simple variant regardless of name", () => {
      render(<LinkedInBadge name="Jane Smith" variant="simple" />)

      expect(screen.getByText("Verified")).toBeInTheDocument()
      expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument()
    })
  })

  describe("Unlink Button", () => {
    it("should render unlink button when onUnlink is provided", () => {
      const mockOnUnlink = jest.fn()
      render(<LinkedInBadge onUnlink={mockOnUnlink} />)

      const unlinkButton = screen.getByRole("button", {
        name: "Unlink LinkedIn",
      })
      expect(unlinkButton).toBeInTheDocument()
    })

    it("should not render unlink button when onUnlink is not provided", () => {
      render(<LinkedInBadge />)

      expect(
        screen.queryByRole("button", { name: "Unlink LinkedIn" })
      ).not.toBeInTheDocument()
    })

    it("should call onUnlink when unlink button is clicked", () => {
      const mockOnUnlink = jest.fn()
      render(<LinkedInBadge onUnlink={mockOnUnlink} />)

      const unlinkButton = screen.getByRole("button", {
        name: "Unlink LinkedIn",
      })
      fireEvent.click(unlinkButton)

      expect(mockOnUnlink).toHaveBeenCalledTimes(1)
    })

    it("should display cross icon when not unlinking", () => {
      const mockOnUnlink = jest.fn()
      render(<LinkedInBadge onUnlink={mockOnUnlink} isUnlinking={false} />)

      expect(screen.getByTestId("cross-icon")).toBeInTheDocument()
      expect(screen.queryByTestId("loader-icon")).not.toBeInTheDocument()
    })

    it("should display loader icon when unlinking", () => {
      const mockOnUnlink = jest.fn()
      render(<LinkedInBadge onUnlink={mockOnUnlink} isUnlinking={true} />)

      expect(screen.getByTestId("loader-icon")).toBeInTheDocument()
      expect(screen.queryByTestId("cross-icon")).not.toBeInTheDocument()
    })

    it("should be disabled when isUnlinking is true", () => {
      const mockOnUnlink = jest.fn()
      render(<LinkedInBadge onUnlink={mockOnUnlink} isUnlinking={true} />)

      const unlinkButton = screen.getByRole("button", {
        name: "Unlink LinkedIn",
      })
      expect(unlinkButton).toBeDisabled()
    })

    it("should not be disabled when isUnlinking is false", () => {
      const mockOnUnlink = jest.fn()
      render(<LinkedInBadge onUnlink={mockOnUnlink} isUnlinking={false} />)

      const unlinkButton = screen.getByRole("button", {
        name: "Unlink LinkedIn",
      })
      expect(unlinkButton).not.toBeDisabled()
    })

    it("should not call onUnlink when disabled", () => {
      const mockOnUnlink = jest.fn()
      render(<LinkedInBadge onUnlink={mockOnUnlink} isUnlinking={true} />)

      const unlinkButton = screen.getByRole("button", {
        name: "Unlink LinkedIn",
      })
      fireEvent.click(unlinkButton)

      expect(mockOnUnlink).not.toHaveBeenCalled()
    })
  })

  describe("Image Error Handling", () => {
    it("should hide image when loading fails", () => {
      render(
        <LinkedInBadge
          name="John Doe"
          picture="https://example.com/broken.jpg"
          variant="full"
        />
      )

      const image = screen.getByAltText("LinkedIn Profile") as HTMLImageElement
      expect(image).toBeInTheDocument()

      // Simulate image load error
      fireEvent.error(image)

      expect(image.style.display).toBe("none")
    })

    it("should have onError handler attached to image", () => {
      render(
        <LinkedInBadge
          name="John Doe"
          picture="https://example.com/pic.jpg"
          variant="full"
        />
      )

      const image = screen.getByAltText("LinkedIn Profile") as HTMLImageElement
      expect(image.onerror).toBeDefined()
    })
  })

  describe("Props Combinations", () => {
    it("should handle all props together in full variant", () => {
      const mockOnUnlink = jest.fn()
      render(
        <LinkedInBadge
          name="Alice Johnson"
          picture="https://example.com/alice.jpg"
          onUnlink={mockOnUnlink}
          isUnlinking={false}
          variant="full"
        />
      )

      expect(screen.getByText("Alice Johnson")).toBeInTheDocument()
      expect(screen.getByAltText("LinkedIn Profile")).toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: "Unlink LinkedIn" })
      ).toBeInTheDocument()
      expect(screen.getByTestId("cross-icon")).toBeInTheDocument()
    })

    it("should handle all props together in simple variant", () => {
      const mockOnUnlink = jest.fn()
      render(
        <LinkedInBadge
          name="Bob Smith"
          picture="https://example.com/bob.jpg"
          onUnlink={mockOnUnlink}
          isUnlinking={false}
          variant="simple"
        />
      )

      expect(screen.getByText("Verified")).toBeInTheDocument()
      expect(screen.queryByText("Bob Smith")).not.toBeInTheDocument()
      expect(screen.queryByAltText("LinkedIn Profile")).not.toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: "Unlink LinkedIn" })
      ).toBeInTheDocument()
    })

    it("should show unlink button in both variants", () => {
      const mockOnUnlink = jest.fn()

      const { rerender } = render(
        <LinkedInBadge
          name="Test User"
          onUnlink={mockOnUnlink}
          variant="full"
        />
      )
      expect(
        screen.getByRole("button", { name: "Unlink LinkedIn" })
      ).toBeInTheDocument()

      rerender(
        <LinkedInBadge
          name="Test User"
          onUnlink={mockOnUnlink}
          variant="simple"
        />
      )
      expect(
        screen.getByRole("button", { name: "Unlink LinkedIn" })
      ).toBeInTheDocument()
    })
  })

  describe("Null and Undefined Handling", () => {
    it("should handle null name", () => {
      render(<LinkedInBadge name={null} variant="full" />)

      expect(screen.getByText("LinkedIn Verified")).toBeInTheDocument()
    })

    it("should handle undefined name", () => {
      render(<LinkedInBadge name={undefined} variant="full" />)

      expect(screen.getByText("LinkedIn Verified")).toBeInTheDocument()
    })

    it("should handle null picture", () => {
      render(<LinkedInBadge name="Test" picture={null} variant="full" />)

      expect(screen.queryByAltText("LinkedIn Profile")).not.toBeInTheDocument()
    })

    it("should handle undefined picture", () => {
      render(<LinkedInBadge name="Test" picture={undefined} variant="full" />)

      expect(screen.queryByAltText("LinkedIn Profile")).not.toBeInTheDocument()
    })
  })

  describe("Accessibility", () => {
    it("should have proper aria-label on unlink button", () => {
      const mockOnUnlink = jest.fn()
      render(<LinkedInBadge onUnlink={mockOnUnlink} />)

      const button = screen.getByLabelText("Unlink LinkedIn")
      expect(button).toBeInTheDocument()
    })

    it("should have alt text on profile image", () => {
      render(
        <LinkedInBadge
          name="Test"
          picture="https://example.com/pic.jpg"
          variant="full"
        />
      )

      const image = screen.getByAltText("LinkedIn Profile")
      expect(image).toBeInTheDocument()
    })
  })

  describe("CSS Classes", () => {
    it("should apply correct classes to badge container", () => {
      const { container } = render(<LinkedInBadge />)

      const badge = container.querySelector(
        ".relative.flex.flex-row.items-center"
      )
      expect(badge).toBeInTheDocument()
    })

    it("should apply LinkedIn blue background to icon container", () => {
      const { container } = render(<LinkedInBadge />)

      const iconContainer = container.querySelector(".bg-\\[\\#0A66C2\\]")
      expect(iconContainer).toBeInTheDocument()
    })
  })
})
