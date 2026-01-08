import React from "react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/utils/services/internationalization/client"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import { EMessageType } from "@/types/common/message-type"
import { EReferralType } from "@/types/common/referral-type"
import { EUserStatus } from "@/types/common/user-status"
import useMessagePostCreator from "@/hooks/api/message/post-creator"
import useMessageReferral from "@/hooks/api/message/referral"
import useUserStore from "@/hooks/state/user/store"
import { useToast } from "@/components/ui/use-toast"

import ContactDialog from "./contact"

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

// Mock internationalization
jest.mock("@/utils/services/internationalization/client", () => ({
  useI18n: jest.fn(),
  useCurrentLocale: jest.fn(() => "en-ca"),
}))

// Mock hooks
jest.mock("@/hooks/api/message/referral")
jest.mock("@/hooks/api/message/post-creator")
jest.mock("@/hooks/state/user/store")
jest.mock("@/components/ui/use-toast")

// Mock media upload utilities
jest.mock("@/utils/common/api", () => ({
  uploadMedia: jest.fn(),
  getMediaPublicUrl: jest.fn(),
}))

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockUseI18n = useI18n as jest.MockedFunction<typeof useI18n>
const mockUseMessageReferral = useMessageReferral as jest.MockedFunction<
  typeof useMessageReferral
>
const mockUseMessagePostCreator = useMessagePostCreator as jest.MockedFunction<
  typeof useMessagePostCreator
>
const mockUseUserStore = useUserStore as unknown as jest.MockedFunction<any>
const mockUseToast = useToast as jest.MockedFunction<typeof useToast>

/**
 * ContactDialog component tests
 * @group unit
 */
describe("ContactDialog", () => {
  const mockPush = jest.fn()
  const mockToast = jest.fn()
  const mockMessageReferral = jest.fn()
  const mockMessagePostCreator = jest.fn()
  const mockOnContactFormClose = jest.fn()

  const defaultProps = {
    open: true,
    username: "johndoe",
    onContactFormClose: mockOnContactFormClose,
    messageType: EMessageType.REFERRAL,
    receiverType: EReferralType.REFERRER,
    toUuid: "receiver-uuid-123",
    postUuid: null,
  }

  const mockT = jest.fn((key: string, options?: any) => {
    const translations: Record<string, string> = {
      "referral.form.send_message_to": "Send message to",
      "referral.form.find_job_in_advance_reminder":
        "Please find the job posting in advance",
      "referral.form.ai_warning": "AI-generated messages may be rejected",
      "referral.form.message_label": "Message",
      "referral.form.message_placeholder": "Enter your message...",
      "referral.form.profile_incomplete_placeholder":
        "To help people contact you better, please add more description to your profile or complete LinkedIn verification.",
      "referral.form.resume_optional_label": "Resume (Optional)",
      "referral.form.resume_description_label":
        "Upload your resume in PDF format",
      "referral.form.cancel": "Cancel",
      "referral.form.submit": "Submit",
      "referral.form.contact.success_title": "Message sent successfully",
      "referral.form.contact.success_description": "Your message has been sent",
      "referral.form.contact.error.title": "Error",
      "referral.form.contact.error.description": "Failed to send message",
      "general.wait": "Please wait...",
      "general.view": "View",
      "general.action_restricted_please_contact_admin":
        "Action restricted, please contact admin",
      "validation.text.maximum_length": `Maximum length is ${options?.count}`,
      "validation.text.minimum_length": `Minimum length is ${options?.count}`,
    }
    return translations[key] || key
  })

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup router mock
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    })

    // Setup i18n mock
    mockUseI18n.mockReturnValue(mockT)

    // Setup user store mock with complete profile
    mockUseUserStore.mockImplementation((selector: any) => {
      const state = {
        uuid: "user-uuid-123",
        status: EUserStatus.ACTIVE,
        description: "I am a software engineer with 5 years of experience",
        hasLinkedInVerification: false,
      }
      return selector(state)
    })

    // Setup toast mock
    mockUseToast.mockReturnValue({
      toast: mockToast,
      dismiss: jest.fn(),
      toasts: [],
    })

    // Setup message referral mock
    mockUseMessageReferral.mockReturnValue({
      mutate: mockMessageReferral,
      isLoading: false,
      isError: false,
      error: null,
    } as any)

    // Setup message post creator mock
    mockUseMessagePostCreator.mockReturnValue({
      mutate: mockMessagePostCreator,
      isLoading: false,
      isError: false,
      error: null,
    } as any)
  })

  describe("Rendering", () => {
    it("should render dialog when open", () => {
      render(<ContactDialog {...defaultProps} />)

      expect(screen.getByText(/Send message to johndoe/i)).toBeInTheDocument()
      expect(screen.getByRole("textbox")).toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: /Cancel/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: /Submit/i })
      ).toBeInTheDocument()
    })

    it("should not show warning for post creator message type", () => {
      render(
        <ContactDialog
          {...defaultProps}
          messageType={EMessageType.POST}
          postUuid="post-uuid-123"
        />
      )

      expect(
        screen.queryByText(/Find a specific job post before reaching out/i)
      ).not.toBeInTheDocument()
    })
  })

  describe("Profile Validation", () => {
    it("should enable textarea when user has description", () => {
      render(<ContactDialog {...defaultProps} />)

      const textarea = screen.getByRole("textbox")
      expect(textarea).not.toBeDisabled()
      expect(textarea).not.toHaveAttribute("readonly")
    })

    it("should enable textarea when user has LinkedIn verification", () => {
      mockUseUserStore.mockImplementation((selector: any) => {
        const state = {
          uuid: "user-uuid-123",
          status: EUserStatus.ACTIVE,
          description: null,
          hasLinkedInVerification: true,
        }
        return selector(state)
      })

      render(<ContactDialog {...defaultProps} />)

      const textarea = screen.getByRole("textbox")
      expect(textarea).not.toBeDisabled()
    })

    it("should disable textarea when user has no description and no LinkedIn verification", () => {
      mockUseUserStore.mockImplementation((selector: any) => {
        const state = {
          uuid: "user-uuid-123",
          status: EUserStatus.ACTIVE,
          description: null,
          hasLinkedInVerification: false,
        }
        return selector(state)
      })

      render(<ContactDialog {...defaultProps} />)

      const textarea = screen.getByRole("textbox")
      expect(textarea).toHaveAttribute("readonly")
      // Textarea uses readonly instead of disabled
    })

    it("should disable textarea when user has empty description", () => {
      mockUseUserStore.mockImplementation((selector: any) => {
        const state = {
          uuid: "user-uuid-123",
          status: EUserStatus.ACTIVE,
          description: "   ",
          hasLinkedInVerification: false,
        }
        return selector(state)
      })

      render(<ContactDialog {...defaultProps} />)

      const textarea = screen.getByRole("textbox")
      expect(textarea).toHaveAttribute("readonly")
      // Textarea uses readonly instead of disabled
    })

    it("should show profile incomplete placeholder when profile is incomplete", () => {
      mockUseUserStore.mockImplementation((selector: any) => {
        const state = {
          uuid: "user-uuid-123",
          status: EUserStatus.ACTIVE,
          description: null,
          hasLinkedInVerification: false,
        }
        return selector(state)
      })

      render(<ContactDialog {...defaultProps} />)

      const textarea = screen.getByPlaceholderText(
        /To help people contact you better/i
      )
      expect(textarea).toBeInTheDocument()
    })

    it("should disable submit button when profile is incomplete", () => {
      mockUseUserStore.mockImplementation((selector: any) => {
        const state = {
          uuid: "user-uuid-123",
          status: EUserStatus.ACTIVE,
          description: null,
          hasLinkedInVerification: false,
        }
        return selector(state)
      })

      render(<ContactDialog {...defaultProps} />)

      const submitButton = screen.getByRole("button", { name: /Submit/i })
      expect(submitButton).toBeDisabled()
    })
  })

  describe("Form Submission", () => {
    it("should submit referral message successfully", async () => {
      mockMessageReferral.mockImplementation((data, { onSuccess }) => {
        onSuccess({ conversation_uuid: "conversation-uuid-123" })
      })

      render(<ContactDialog {...defaultProps} />)

      const textarea = screen.getByRole("textbox")
      fireEvent.change(textarea, {
        target: {
          value:
            "Hello, I am interested in this position. I have 5 years of experience in software development.",
        },
      })

      const submitButton = screen.getByRole("button", { name: /Submit/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockMessageReferral).toHaveBeenCalledWith(
          expect.objectContaining({
            type: EReferralType.REFERRER,
            body: "Hello, I am interested in this position. I have 5 years of experience in software development.",
            toUuid: "receiver-uuid-123",
            document: null,
          }),
          expect.any(Object)
        )
      })
    })

    it("should submit post creator message successfully", async () => {
      mockMessagePostCreator.mockImplementation((data, { onSuccess }) => {
        onSuccess({ conversation_uuid: "conversation-uuid-123" })
      })

      render(
        <ContactDialog
          {...defaultProps}
          messageType={EMessageType.POST}
          postUuid="post-uuid-123"
        />
      )

      const textarea = screen.getByRole("textbox")
      fireEvent.change(textarea, {
        target: {
          value:
            "Hello, I am interested in your post. Please let me know more details about the opportunity.",
        },
      })

      const submitButton = screen.getByRole("button", { name: /Submit/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockMessagePostCreator).toHaveBeenCalledWith(
          expect.objectContaining({
            body: "Hello, I am interested in your post. Please let me know more details about the opportunity.",
            postUuid: "post-uuid-123",
            document: null,
          }),
          expect.any(Object)
        )
      })
    })

    it("should show success toast on successful submission", async () => {
      mockMessageReferral.mockImplementation((data, { onSuccess }) => {
        onSuccess({ conversation_uuid: "conversation-uuid-123" })
      })

      render(<ContactDialog {...defaultProps} />)

      const textarea = screen.getByRole("textbox")
      fireEvent.change(textarea, {
        target: {
          value:
            "Hello, I am interested in this position. I have 5 years of experience.",
        },
      })

      const submitButton = screen.getByRole("button", { name: /Submit/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Message sent successfully",
            description: "Your message has been sent",
          })
        )
      })
    })

    it("should close dialog on successful submission", async () => {
      mockMessageReferral.mockImplementation((data, { onSuccess }) => {
        onSuccess({ conversation_uuid: "conversation-uuid-123" })
      })

      render(<ContactDialog {...defaultProps} />)

      const textarea = screen.getByRole("textbox")
      fireEvent.change(textarea, {
        target: {
          value:
            "Hello, I am interested in this position. I have 5 years of experience.",
        },
      })

      const submitButton = screen.getByRole("button", { name: /Submit/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnContactFormClose).toHaveBeenCalled()
      })
    })

    it("should show error toast on submission failure", async () => {
      mockMessageReferral.mockImplementation((data, { onError }) => {
        onError(new Error("Network error"))
      })

      render(<ContactDialog {...defaultProps} />)

      const textarea = screen.getByRole("textbox")
      fireEvent.change(textarea, {
        target: {
          value:
            "Hello, I am interested in this position. I have 5 years of experience.",
        },
      })

      const submitButton = screen.getByRole("button", { name: /Submit/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Error",
            description: "Failed to send message",
            variant: "destructive",
          })
        )
      })
    })

    it("should show restricted action toast for inactive users", async () => {
      mockUseUserStore.mockImplementation((selector: any) => {
        const state = {
          uuid: "user-uuid-123",
          status: EUserStatus.INACTIVE,
          description: "I am a software engineer",
          hasLinkedInVerification: false,
        }
        return selector(state)
      })

      render(<ContactDialog {...defaultProps} />)

      const textarea = screen.getByRole("textbox")
      fireEvent.change(textarea, {
        target: {
          value:
            "Hello, I am interested in this position. I have 5 years of experience.",
        },
      })

      const submitButton = screen.getByRole("button", { name: /Submit/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Action restricted, please contact admin",
            variant: "destructive",
          })
        )
      })

      expect(mockMessageReferral).not.toHaveBeenCalled()
    })
  })

  describe("Form Validation", () => {
    it("should show error for message less than 50 characters", async () => {
      render(<ContactDialog {...defaultProps} />)

      const textarea = screen.getByRole("textbox")
      fireEvent.change(textarea, {
        target: { value: "Short message" },
      })

      const submitButton = screen.getByRole("button", { name: /Submit/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/Minimum length is 50/i)).toBeInTheDocument()
      })
    })

    it("should show error for message more than 3000 characters", async () => {
      render(<ContactDialog {...defaultProps} />)

      const longMessage = "a".repeat(3001)
      const textarea = screen.getByRole("textbox")
      fireEvent.change(textarea, {
        target: { value: longMessage },
      })

      const submitButton = screen.getByRole("button", { name: /Submit/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/Maximum length is 3000/i)).toBeInTheDocument()
      })
    })
  })

  describe("Dialog Actions", () => {
    it("should close dialog when cancel button is clicked", () => {
      render(<ContactDialog {...defaultProps} />)

      const cancelButton = screen.getByRole("button", { name: /Cancel/i })
      fireEvent.click(cancelButton)

      expect(mockOnContactFormClose).toHaveBeenCalled()
    })

    it("should disable submit button while loading", async () => {
      mockMessageReferral.mockImplementation((data, { onSettled }) => {
        // Simulate loading state by delaying onSettled
        setTimeout(() => {
          onSettled()
        }, 100)
      })

      render(<ContactDialog {...defaultProps} />)

      const textarea = screen.getByRole("textbox")
      fireEvent.change(textarea, {
        target: {
          value:
            "Hello, I am interested in this position. I have 5 years of experience.",
        },
      })

      const submitButton = screen.getByRole("button", { name: /Submit/i })
      fireEvent.click(submitButton)

      // Button should be disabled and show "Please wait" while loading
      await waitFor(() => {
        const loadingButton = screen.getByRole("button", {
          name: /Please wait/i,
        })
        expect(loadingButton).toBeDisabled()
      })
    })
  })
})
