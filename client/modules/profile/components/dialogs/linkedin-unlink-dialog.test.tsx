import React from "react"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import "@testing-library/jest-dom"
import LinkedInUnlinkDialog from "./linkedin-unlink-dialog"

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
const mockGetUserIdentities = jest.fn()
const mockUnlinkIdentity = jest.fn()

jest.mock("@/utils/services/supabase/config", () => ({
  supabase: {
    auth: {
      getUserIdentities: () => mockGetUserIdentities(),
      unlinkIdentity: (identity: any) => mockUnlinkIdentity(identity),
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

// Mock @tanstack/react-query
jest.mock("@tanstack/react-query", () => ({
  useQueryClient: jest.fn(() => ({
    invalidateQueries: jest.fn(),
  })),
}))

// Mock UI components
jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open }: any) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogDescription: ({ children }: any) => <p>{children}</p>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}))

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, variant }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      data-testid={
        variant === "destructive" ? "confirm-button" : "cancel-button"
      }
    >
      {children}
    </button>
  ),
}))

// Mock Icons
jest.mock("@/components/icons", () => ({
  Icons: {
    loader: ({ className }: any) => (
      <div data-testid="loader-icon" className={className}>
        Loading
      </div>
    ),
  },
}))

/**
 * LinkedInUnlinkDialog component tests
 * @group unit
 */
describe("LinkedInUnlinkDialog Component", () => {
  const mockOnOpenChange = jest.fn()
  const mockOnSuccess = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    console.log = jest.fn()
    console.error = jest.fn()

    // Default: user has LinkedIn identity
    mockGetUserIdentities.mockResolvedValue({
      data: {
        identities: [
          {
            id: "linkedin-identity-123",
            provider: "linkedin_oidc",
          },
        ],
      },
      error: null,
    })
  })

  describe("Rendering", () => {
    it("should render dialog when open is true", () => {
      render(
        <LinkedInUnlinkDialog open={true} onOpenChange={mockOnOpenChange} />
      )

      expect(screen.getByTestId("dialog")).toBeInTheDocument()
      expect(
        screen.getByText("profile.linkedin.unlink.dialog.title")
      ).toBeInTheDocument()
    })

    it("should not render dialog when open is false", () => {
      render(
        <LinkedInUnlinkDialog open={false} onOpenChange={mockOnOpenChange} />
      )

      expect(screen.queryByTestId("dialog")).not.toBeInTheDocument()
    })

    it("should display warning message", () => {
      render(
        <LinkedInUnlinkDialog open={true} onOpenChange={mockOnOpenChange} />
      )

      expect(
        screen.getByText("profile.linkedin.unlink.dialog.description")
      ).toBeInTheDocument()
    })

    it("should render Cancel and Confirm buttons", () => {
      render(
        <LinkedInUnlinkDialog open={true} onOpenChange={mockOnOpenChange} />
      )

      expect(screen.getByTestId("cancel-button")).toBeInTheDocument()
      expect(screen.getByTestId("confirm-button")).toBeInTheDocument()
      expect(
        screen.getByText("profile.linkedin.unlink.button.cancel")
      ).toBeInTheDocument()
      expect(
        screen.getByText("profile.linkedin.unlink.button.confirm")
      ).toBeInTheDocument()
    })
  })

  describe("Cancel Action", () => {
    it("should call onOpenChange(false) when Cancel is clicked", () => {
      render(
        <LinkedInUnlinkDialog open={true} onOpenChange={mockOnOpenChange} />
      )

      const cancelButton = screen.getByTestId("cancel-button")
      fireEvent.click(cancelButton)

      expect(mockOnOpenChange).toHaveBeenCalledWith(false)
      expect(mockUnlinkIdentity).not.toHaveBeenCalled()
    })
  })

  describe("Confirm Unlink Action", () => {
    it("should call Supabase unlinkIdentity when confirmed", async () => {
      mockUnlinkIdentity.mockResolvedValue({ error: null })

      render(
        <LinkedInUnlinkDialog open={true} onOpenChange={mockOnOpenChange} />
      )

      const confirmButton = screen.getByTestId("confirm-button")
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(mockGetUserIdentities).toHaveBeenCalled()
        expect(mockUnlinkIdentity).toHaveBeenCalledWith({
          id: "linkedin-identity-123",
          provider: "linkedin_oidc",
        })
      })
    })

    it("should show success toast after unlinking", async () => {
      mockUnlinkIdentity.mockResolvedValue({ error: null })

      render(
        <LinkedInUnlinkDialog open={true} onOpenChange={mockOnOpenChange} />
      )

      const confirmButton = screen.getByTestId("confirm-button")
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "profile.linkedin.unlink.success.title",
          description: "profile.linkedin.unlink.success.description",
        })
      })
    })

    it("should close dialog after successful unlink", async () => {
      mockUnlinkIdentity.mockResolvedValue({ error: null })

      render(
        <LinkedInUnlinkDialog open={true} onOpenChange={mockOnOpenChange} />
      )

      const confirmButton = screen.getByTestId("confirm-button")
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(mockOnOpenChange).toHaveBeenCalledWith(false)
      })
    })

    it("should call onSuccess callback if provided", async () => {
      mockUnlinkIdentity.mockResolvedValue({ error: null })

      render(
        <LinkedInUnlinkDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSuccess={mockOnSuccess}
        />
      )

      const confirmButton = screen.getByTestId("confirm-button")
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled()
      })

      expect(mockRefresh).not.toHaveBeenCalled()
    })

    it("should refresh page if onSuccess not provided", async () => {
      mockUnlinkIdentity.mockResolvedValue({ error: null })

      render(
        <LinkedInUnlinkDialog open={true} onOpenChange={mockOnOpenChange} />
      )

      const confirmButton = screen.getByTestId("confirm-button")
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(mockRefresh).toHaveBeenCalled()
      })
    })
  })

  describe("Loading State", () => {
    it("should show loading state when unlinking", async () => {
      mockUnlinkIdentity.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ error: null }), 100)
          )
      )

      render(
        <LinkedInUnlinkDialog open={true} onOpenChange={mockOnOpenChange} />
      )

      const confirmButton = screen.getByTestId("confirm-button")
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(screen.getByTestId("loader-icon")).toBeInTheDocument()
        expect(
          screen.getByText("profile.linkedin.unlink.button.unlinking")
        ).toBeInTheDocument()
      })
    })

    it("should disable both buttons while unlinking", async () => {
      mockUnlinkIdentity.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ error: null }), 100)
          )
      )

      render(
        <LinkedInUnlinkDialog open={true} onOpenChange={mockOnOpenChange} />
      )

      const confirmButton = screen.getByTestId("confirm-button")
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(screen.getByTestId("cancel-button")).toBeDisabled()
        expect(screen.getByTestId("confirm-button")).toBeDisabled()
      })
    })
  })

  describe("Error Handling", () => {
    it("should show error toast when no LinkedIn identity found", async () => {
      mockGetUserIdentities.mockResolvedValue({
        data: {
          identities: [],
        },
        error: null,
      })

      render(
        <LinkedInUnlinkDialog open={true} onOpenChange={mockOnOpenChange} />
      )

      const confirmButton = screen.getByTestId("confirm-button")
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "general.error.title",
          description: "profile.linkedin.unlink.error.no_account",
          variant: "destructive",
        })
      })

      expect(mockUnlinkIdentity).not.toHaveBeenCalled()
    })

    it("should show error toast when unlinkIdentity fails", async () => {
      mockUnlinkIdentity.mockResolvedValue({
        error: { message: "Failed to unlink" },
      })

      render(
        <LinkedInUnlinkDialog open={true} onOpenChange={mockOnOpenChange} />
      )

      const confirmButton = screen.getByTestId("confirm-button")
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "general.error.title",
          description: "profile.linkedin.unlink.error.failed",
          variant: "destructive",
        })
      })

      expect(mockOnOpenChange).not.toHaveBeenCalled()
    })

    it("should handle exception during unlink", async () => {
      mockGetUserIdentities.mockRejectedValue(new Error("Network error"))

      render(
        <LinkedInUnlinkDialog open={true} onOpenChange={mockOnOpenChange} />
      )

      const confirmButton = screen.getByTestId("confirm-button")
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "general.error.title",
          description: "profile.linkedin.unlink.error.failed",
          variant: "destructive",
        })
      })
    })

    it("should re-enable buttons after error", async () => {
      mockUnlinkIdentity.mockResolvedValue({
        error: { message: "Failed to unlink" },
      })

      render(
        <LinkedInUnlinkDialog open={true} onOpenChange={mockOnOpenChange} />
      )

      const confirmButton = screen.getByTestId("confirm-button")
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalled()
      })

      expect(confirmButton).not.toBeDisabled()
      expect(screen.getByTestId("cancel-button")).not.toBeDisabled()
    })
  })

  describe("Console Logging", () => {
    it("should log error when unlinkIdentity fails", async () => {
      const error = { message: "Failed to unlink" }
      mockUnlinkIdentity.mockResolvedValue({ error })

      render(
        <LinkedInUnlinkDialog open={true} onOpenChange={mockOnOpenChange} />
      )

      const confirmButton = screen.getByTestId("confirm-button")
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          "LinkedIn unlink error:",
          error
        )
      })
    })
  })

  describe("Button Variants", () => {
    it("should use correct button variants", () => {
      render(
        <LinkedInUnlinkDialog open={true} onOpenChange={mockOnOpenChange} />
      )

      expect(screen.getByTestId("cancel-button")).toHaveAttribute(
        "data-variant",
        "ghost"
      )
      expect(screen.getByTestId("confirm-button")).toHaveAttribute(
        "data-variant",
        "destructive"
      )
    })
  })
})
