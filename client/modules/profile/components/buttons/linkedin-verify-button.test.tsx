import React from "react"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import "@testing-library/jest-dom"
import LinkedInVerifyButton from "./linkedin-verify-button"

// Mock Next.js router
const mockPush = jest.fn()
const mockRefresh = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}))

// Mock internationalization
jest.mock("@/utils/services/internationalization/client", () => ({
  useI18n: () => (key: string) => key,
}))

// Mock Supabase
const mockLinkIdentity = jest.fn()

jest.mock("@/utils/services/supabase/config", () => ({
  supabase: {
    auth: {
      linkIdentity: (options: any) => mockLinkIdentity(options),
    },
  },
}))

// Mock toast
const mockToast = jest.fn()
jest.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}))

// Mock Icons
jest.mock("@/components/icons", () => ({
  Icons: {
    loader: ({ className }: any) => (
      <div data-testid="loader-icon" className={className}>
        Loading
      </div>
    ),
    linkedin: ({ size }: any) => (
      <div data-testid="linkedin-icon" data-size={size}>
        LinkedIn
      </div>
    ),
  },
}))

/**
 * LinkedInVerifyButton component tests
 * @group unit
 */
describe("LinkedInVerifyButton Component", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    console.log = jest.fn()
    console.error = jest.fn()
  })

  describe("Rendering", () => {
    it("should render button with LinkedIn icon", () => {
      render(<LinkedInVerifyButton />)

      expect(screen.getByTestId("linkedin-icon")).toBeInTheDocument()
    })

    it("should render with text by default", () => {
      render(<LinkedInVerifyButton />)

      expect(
        screen.getByText("profile.linkedin.verify.button.link")
      ).toBeInTheDocument()
    })

    it("should hide text when showText is false", () => {
      render(<LinkedInVerifyButton showText={false} />)

      expect(
        screen.queryByText("profile.linkedin.verify.button.link")
      ).not.toBeInTheDocument()
      expect(screen.getByTestId("linkedin-icon")).toBeInTheDocument()
    })

    it("should apply custom className", () => {
      const { container } = render(
        <LinkedInVerifyButton className="custom-class" />
      )

      const button = container.querySelector("button")
      expect(button).toHaveClass("custom-class")
    })

    it("should have LinkedIn brand color", () => {
      const { container } = render(<LinkedInVerifyButton />)

      const button = container.querySelector("button")
      expect(button).toHaveClass("bg-[#0A66C2]")
    })
  })

  describe("Click Interaction", () => {
    it("should call Supabase linkIdentity when clicked", async () => {
      mockLinkIdentity.mockResolvedValue({ data: {}, error: null })

      render(<LinkedInVerifyButton />)

      const button = screen.getByRole("button")
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockLinkIdentity).toHaveBeenCalledWith({
          provider: "linkedin_oidc",
          options: {
            redirectTo: window.location.href,
            scopes: "openid profile email",
          },
        })
      })
    })

    it("should show loading state when verifying", async () => {
      mockLinkIdentity.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ data: {}, error: null }), 100)
          )
      )

      render(<LinkedInVerifyButton />)

      const button = screen.getByRole("button")
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByTestId("loader-icon")).toBeInTheDocument()
        expect(screen.getByText("general.wait")).toBeInTheDocument()
      })
    })

    it("should disable button while verifying", async () => {
      mockLinkIdentity.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ data: {}, error: null }), 100)
          )
      )

      render(<LinkedInVerifyButton />)

      const button = screen.getByRole("button")
      fireEvent.click(button)

      await waitFor(() => {
        expect(button).toBeDisabled()
      })
    })
  })

  describe("Error Handling", () => {
    it("should show error toast when linkIdentity fails", async () => {
      mockLinkIdentity.mockResolvedValue({
        data: null,
        error: { message: "Failed to link" },
      })

      render(<LinkedInVerifyButton />)

      const button = screen.getByRole("button")
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "general.error.title",
          description: "profile.linkedin.verify.error.failed_to_start",
          variant: "destructive",
        })
      })
    })

    it("should handle exception during verification", async () => {
      mockLinkIdentity.mockRejectedValue(new Error("Network error"))

      render(<LinkedInVerifyButton />)

      const button = screen.getByRole("button")
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "general.error.title",
          description: "profile.linkedin.verify.error.failed",
          variant: "destructive",
        })
      })
    })

    it("should re-enable button after error", async () => {
      mockLinkIdentity.mockResolvedValue({
        data: null,
        error: { message: "Failed to link" },
      })

      render(<LinkedInVerifyButton />)

      const button = screen.getByRole("button")
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalled()
      })

      expect(button).not.toBeDisabled()
    })
  })

  describe("Loading States with showText", () => {
    it("should show loading icon without text when showText is false", async () => {
      mockLinkIdentity.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ data: {}, error: null }), 100)
          )
      )

      render(<LinkedInVerifyButton showText={false} />)

      const button = screen.getByRole("button")
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByTestId("loader-icon")).toBeInTheDocument()
        expect(screen.queryByText("general.wait")).not.toBeInTheDocument()
      })
    })
  })

  describe("Console Logging", () => {
    it("should log error when linkIdentity fails", async () => {
      const error = { message: "Failed to link" }
      mockLinkIdentity.mockResolvedValue({
        data: null,
        error,
      })

      render(<LinkedInVerifyButton />)

      const button = screen.getByRole("button")
      fireEvent.click(button)

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          "LinkedIn link error:",
          error
        )
      })
    })
  })

  describe("Accessibility", () => {
    it("should be keyboard accessible", () => {
      render(<LinkedInVerifyButton />)

      const button = screen.getByRole("button")
      expect(button).toBeInTheDocument()
    })

    it("should have proper disabled state for screen readers", async () => {
      mockLinkIdentity.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ data: {}, error: null }), 100)
          )
      )

      render(<LinkedInVerifyButton />)

      const button = screen.getByRole("button")
      fireEvent.click(button)

      await waitFor(() => {
        expect(button).toHaveAttribute("disabled")
      })
    })
  })
})
