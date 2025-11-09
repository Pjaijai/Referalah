import React from "react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/utils/services/internationalization/client"
import { supabase } from "@/utils/services/supabase/config"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import { ESocialLink } from "@/types/common/social-links"
import { siteConfig } from "@/config/site"
import useUserStore from "@/hooks/state/user/store"
import { useToast } from "@/components/ui/use-toast"

import ViewProfileTemplate, { IViewProfileTemplateProps } from "./template"

// Mock all dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

jest.mock("@/utils/services/internationalization/client")
jest.mock("@/hooks/state/user/store")
jest.mock("@/components/ui/use-toast")
jest.mock("@/utils/services/supabase/config", () => ({
  supabase: {
    auth: {
      signOut: jest.fn(),
    },
  },
}))

// Mock components
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, className, size, variant, ...props }: any) => (
    <button
      onClick={onClick}
      className={className}
      data-size={size}
      data-variant={variant}
      {...props}
    >
      {children}
    </button>
  ),
  buttonVariants: jest.fn(() => "button-variants"),
}))

jest.mock("@/components/customized-ui/avatars/base", () => {
  return function MockBaseAvatar({ url, alt, fallBack, size }: any) {
    return (
      <div
        data-testid="base-avatar"
        data-url={url}
        data-alt={alt}
        data-fallback={fallBack}
        data-size={size}
      >
        Avatar: {alt || fallBack}
      </div>
    )
  }
})

jest.mock("@/components/customized-ui/badges/referee/referee", () => {
  return function MockRefereeBadge() {
    return <div data-testid="referee-badge">Referee</div>
  }
})

jest.mock("@/components/customized-ui/badges/referrer/referrer", () => {
  return function MockReferrerBadge() {
    return <div data-testid="referrer-badge">Referrer</div>
  }
})

jest.mock("@/components/customized-ui/buttons/contact", () => {
  return function MockContactButton({
    username,
    toUuid,
    messageType,
    receiverType,
    buttonClassName,
    showIcon,
  }: any) {
    return (
      <button
        data-testid="contact-button"
        className={buttonClassName}
        data-username={username}
        data-to-uuid={toUuid}
        data-message-type={messageType}
        data-receiver-type={receiverType}
        data-show-icon={showIcon}
      >
        Contact {username}
      </button>
    )
  }
})

jest.mock("@/components/customized-ui/icons/social-icon-with-tooltip", () => {
  return function MockSocialIconWithTooltip({ type, url, name }: any) {
    return (
      <div
        data-testid="social-icon"
        data-type={type}
        data-url={url}
        data-name={name}
      >
        {name}
      </div>
    )
  }
})

jest.mock("@/components/icons", () => ({
  Icons: {
    chevronLeft: ({ className }: any) => (
      <div data-testid="chevron-left-icon" className={className}>
        ←
      </div>
    ),
    pencil: ({ size }: any) => (
      <div data-testid="pencil-icon" data-size={size}>
        ✏️
      </div>
    ),
    industry: ({ className }: any) => (
      <div data-testid="industry-icon" className={className}>
        🏭
      </div>
    ),
    yearsOfExperience: ({ className }: any) => (
      <div data-testid="years-icon" className={className}>
        📅
      </div>
    ),
    location: ({ className }: any) => (
      <div data-testid="location-icon" className={className}>
        📍
      </div>
    ),
    coffee: ({ className, size }: any) => (
      <div data-testid="coffee-icon" className={className} data-size={size}>
        ☕
      </div>
    ),
    clipboard: ({ className, size }: any) => (
      <div data-testid="clipboard-icon" className={className} data-size={size}>
        📋
      </div>
    ),
    briefcase: ({ size }: any) => (
      <div data-testid="briefcase-icon" data-size={size}>
        💼
      </div>
    ),
    logOut: ({ size }: any) => (
      <div data-testid="logout-icon" data-size={size}>
        🚪
      </div>
    ),
  },
}))

// Mock hooks
const mockPush = jest.fn()
const mockBack = jest.fn()
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockUseI18n = useI18n as jest.MockedFunction<typeof useI18n>
const mockUseUserStore = useUserStore as unknown as jest.MockedFunction<any>
const mockUseToast = useToast as jest.MockedFunction<typeof useToast>
const mockToast = jest.fn()

/**
 * ViewProfileTemplate component tests
 * @group unit
 */
describe("ViewProfileTemplate", () => {
  const mockProps: IViewProfileTemplateProps = {
    photoUrl: "https://example.com/photo.jpg",
    username: "johndoe",
    description: "Software engineer with 5 years of experience",
    company: "Tech Corp",
    jobTitle: "Senior Developer",
    yearOfExperience: 5,
    location: "Ontario - Toronto",
    socialLinks: [
      {
        type: ESocialLink.LINKEDIN,
        url: "https://linkedin.com/in/johndoe",
        name: "LinkedIn Profile",
      },
    ],
    industry: "Technology",
    isReferer: true,
    isReferee: false,
    slug: "user-uuid",
    requestCount: 10,
    postCount: 5,
  }

  const mockT = jest.fn((key: string, options?: any) => {
    const translations: Record<string, string> = {
      "profile.view.edit_profile": "Edit Profile",
      "profile.view.introduction": "Introduction",
      "profile.view.community": "Community",
      "profile.section.social_links": "Social Links",
      "general.year_of_experience_count": `${options?.count} years of experience`,
      "general.post": "Post",
      "general.post_history": "Post History",
      "general.sign_out": "Sign Out",
      "page.job_journey_history": "Job Journey History",
      "auth.form.sign_out.success": "Successfully signed out",
      "auth.form.sign_out.error": "Sign out failed",
      "general.error.description": "An error occurred",
    }
    return translations[key] || key
  })

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()

    // Setup router mock
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: mockBack,
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    })

    // Setup i18n mock
    mockUseI18n.mockReturnValue(mockT)

    // Setup user store mock
    mockUseUserStore.mockImplementation((selector: any) => {
      const state = {
        uuid: "current-user-uuid",
        reSetUser: jest.fn(),
      }
      return selector(state)
    })

    // Setup toast mock
    mockUseToast.mockReturnValue({
      toast: mockToast,
      dismiss: jest.fn(),
      toasts: [],
    })

    // Setup supabase mock
    ;(supabase.auth.signOut as jest.Mock).mockResolvedValue({ error: null })
  })

  it("should render profile information correctly", () => {
    render(<ViewProfileTemplate {...mockProps} />)

    // Check basic profile information
    expect(screen.getAllByText("johndoe")[0]).toBeInTheDocument()
    expect(screen.getAllByText("Senior Developer")[0]).toBeInTheDocument()
    expect(screen.getAllByText("@ Tech Corp")[0]).toBeInTheDocument()
    expect(
      screen.getByText("Software engineer with 5 years of experience")
    ).toBeInTheDocument()

    // Check avatar
    expect(screen.getByTestId("base-avatar")).toBeInTheDocument()
    expect(screen.getByTestId("base-avatar")).toHaveAttribute(
      "data-url",
      "https://example.com/photo.jpg"
    )
    expect(screen.getByTestId("base-avatar")).toHaveAttribute(
      "data-alt",
      "johndoe"
    )
  })

  it("should display referrer badge when user is referrer", () => {
    render(<ViewProfileTemplate {...mockProps} />)

    expect(screen.getAllByTestId("referrer-badge")[0]).toBeInTheDocument()
    expect(screen.queryByTestId("referee-badge")).not.toBeInTheDocument()
  })

  it("should display referee badge when user is referee", () => {
    const propsWithReferee = {
      ...mockProps,
      isReferer: false,
      isReferee: true,
    }

    render(<ViewProfileTemplate {...propsWithReferee} />)

    expect(screen.getAllByTestId("referee-badge")[0]).toBeInTheDocument()
    expect(screen.queryByTestId("referrer-badge")).not.toBeInTheDocument()
  })

  it("should display both badges when user is both referrer and referee", () => {
    const propsWithBoth = {
      ...mockProps,
      isReferer: true,
      isReferee: true,
    }

    render(<ViewProfileTemplate {...propsWithBoth} />)

    expect(screen.getAllByTestId("referrer-badge")[0]).toBeInTheDocument()
    expect(screen.getAllByTestId("referee-badge")[0]).toBeInTheDocument()
  })

  it("should show edit profile button when viewing own profile", () => {
    // Mock user viewing their own profile
    mockUseUserStore.mockImplementation((selector: any) => {
      const state = {
        uuid: "user-uuid", // Same as slug
        reSetUser: jest.fn(),
      }
      return selector(state)
    })

    render(<ViewProfileTemplate {...mockProps} />)

    const editButtons = screen.getAllByText("Edit Profile")
    expect(editButtons.length).toBeGreaterThan(0)
  })

  it("should not show edit profile button when viewing other's profile", () => {
    // Mock user viewing different profile
    mockUseUserStore.mockImplementation((selector: any) => {
      const state = {
        uuid: "different-user-uuid", // Different from slug
        reSetUser: jest.fn(),
      }
      return selector(state)
    })

    render(<ViewProfileTemplate {...mockProps} />)

    expect(screen.queryByText("Edit Profile")).not.toBeInTheDocument()
  })

  it("should display professional information correctly", () => {
    render(<ViewProfileTemplate {...mockProps} />)

    expect(screen.getAllByText("Technology")[0]).toBeInTheDocument()
    expect(screen.getAllByText("5 years of experience")[0]).toBeInTheDocument()
    expect(screen.getAllByText("Ontario - Toronto")[0]).toBeInTheDocument()
  })

  it("should display community statistics", () => {
    render(<ViewProfileTemplate {...mockProps} />)

    expect(screen.getByText("10")).toBeInTheDocument() // requestCount
    expect(screen.getByText("5")).toBeInTheDocument() // postCount
    expect(screen.getByText("Community")).toBeInTheDocument()
  })

  it("should display social links", () => {
    render(<ViewProfileTemplate {...mockProps} />)

    expect(screen.getByText("Social Links")).toBeInTheDocument()
    expect(screen.getByTestId("social-icon")).toBeInTheDocument()
    expect(screen.getByTestId("social-icon")).toHaveAttribute(
      "data-name",
      "LinkedIn Profile"
    )
  })

  it("should show post history button when user has posts", () => {
    render(<ViewProfileTemplate {...mockProps} />)

    const postHistoryButton = screen.getByText("Post History")
    expect(postHistoryButton).toBeInTheDocument()
  })

  it("should not show post history button when user has no posts", () => {
    const propsWithNoPosts = {
      ...mockProps,
      postCount: 0,
    }

    render(<ViewProfileTemplate {...propsWithNoPosts} />)

    expect(screen.queryByText("Post History")).not.toBeInTheDocument()
  })

  it("should always show job journey history button", () => {
    render(<ViewProfileTemplate {...mockProps} />)

    expect(screen.getByText("Job Journey History")).toBeInTheDocument()
  })

  it("should show job journey history button even with no posts", () => {
    const propsWithNoPosts = {
      ...mockProps,
      postCount: 0,
    }

    render(<ViewProfileTemplate {...propsWithNoPosts} />)

    expect(screen.getByText("Job Journey History")).toBeInTheDocument()
  })

  it("should navigate to post history when post history button is clicked", () => {
    render(<ViewProfileTemplate {...mockProps} />)

    const postHistoryButton = screen.getByText("Post History")
    fireEvent.click(postHistoryButton)

    expect(mockPush).toHaveBeenCalledWith(
      `${siteConfig.page.postHistory.href}/user-uuid`
    )
  })

  it("should navigate to job journey history when job journey button is clicked", () => {
    render(<ViewProfileTemplate {...mockProps} />)

    const jobJourneyButton = screen.getByText("Job Journey History")
    fireEvent.click(jobJourneyButton)

    expect(mockPush).toHaveBeenCalledWith(
      `${siteConfig.page.jobJourneyHistory.href}/user-uuid`
    )
  })

  it("should navigate to edit profile when edit button is clicked", () => {
    // Mock user viewing their own profile
    mockUseUserStore.mockImplementation((selector: any) => {
      const state = {
        uuid: "user-uuid",
        reSetUser: jest.fn(),
      }
      return selector(state)
    })

    render(<ViewProfileTemplate {...mockProps} />)

    const editButton = screen.getAllByText("Edit Profile")[0]
    fireEvent.click(editButton)

    expect(mockPush).toHaveBeenCalledWith(siteConfig.page.editProfile.href)
  })

  it("should navigate back when back button is clicked", () => {
    render(<ViewProfileTemplate {...mockProps} />)

    const backButton = screen.getByTestId("chevron-left-icon").closest("button")
    expect(backButton).toBeInTheDocument()

    fireEvent.click(backButton!)
    expect(mockBack).toHaveBeenCalled()
  })

  it("should show contact button for referee/referrer when not viewing own profile", () => {
    // Mock user viewing different profile
    mockUseUserStore.mockImplementation((selector: any) => {
      const state = {
        uuid: "different-user-uuid",
        reSetUser: jest.fn(),
      }
      return selector(state)
    })

    render(<ViewProfileTemplate {...mockProps} />)

    expect(screen.getByTestId("contact-button")).toBeInTheDocument()
  })

  it("should not show contact button when viewing own profile", () => {
    // Mock user viewing their own profile
    mockUseUserStore.mockImplementation((selector: any) => {
      const state = {
        uuid: "user-uuid",
        reSetUser: jest.fn(),
      }
      return selector(state)
    })

    render(<ViewProfileTemplate {...mockProps} />)

    expect(screen.queryByTestId("contact-button")).not.toBeInTheDocument()
  })

  it("should show sign out button when viewing own profile", () => {
    // Mock user viewing their own profile
    mockUseUserStore.mockImplementation((selector: any) => {
      const state = {
        uuid: "user-uuid",
        reSetUser: jest.fn(),
      }
      return selector(state)
    })

    render(<ViewProfileTemplate {...mockProps} />)

    expect(screen.getByText("Sign Out")).toBeInTheDocument()
  })

  it("should handle sign out successfully", async () => {
    // Mock user viewing their own profile
    const mockReSetUser = jest.fn()
    mockUseUserStore.mockImplementation((selector: any) => {
      const state = {
        uuid: "user-uuid",
        reSetUser: mockReSetUser,
      }
      return selector(state)
    })

    render(<ViewProfileTemplate {...mockProps} />)

    const signOutButton = screen.getByText("Sign Out")
    fireEvent.click(signOutButton)

    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith(siteConfig.page.main.href)
      expect(mockReSetUser).toHaveBeenCalled()
      expect(mockToast).toHaveBeenCalledWith({
        title: "Successfully signed out",
      })
    })
  })

  it("should handle sign out error", async () => {
    // Mock sign out error
    ;(supabase.auth.signOut as jest.Mock).mockResolvedValue({
      error: new Error("Sign out failed"),
    })

    // Mock user viewing their own profile
    mockUseUserStore.mockImplementation((selector: any) => {
      const state = {
        uuid: "user-uuid",
        reSetUser: jest.fn(),
      }
      return selector(state)
    })

    render(<ViewProfileTemplate {...mockProps} />)

    const signOutButton = screen.getByText("Sign Out")
    fireEvent.click(signOutButton)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Sign out failed",
        description: "An error occurred",
        variant: "destructive",
      })
    })
  })

  it("should handle null/undefined values gracefully", () => {
    const propsWithNulls: IViewProfileTemplateProps = {
      photoUrl: undefined,
      username: null,
      description: null,
      company: null,
      jobTitle: null,
      yearOfExperience: null,
      location: null,
      socialLinks: [],
      industry: null,
      isReferer: false,
      isReferee: false,
      slug: "user-uuid",
      requestCount: 0,
      postCount: 0,
    }

    render(<ViewProfileTemplate {...propsWithNulls} />)

    // Should render without crashing
    expect(screen.getByText("Introduction")).toBeInTheDocument()
    expect(screen.getByText("Community")).toBeInTheDocument()
  })

  it("should not show contact button when user is neither referee nor referrer", () => {
    const propsWithNoRoles = {
      ...mockProps,
      isReferer: false,
      isReferee: false,
    }

    // Mock user viewing different profile
    mockUseUserStore.mockImplementation((selector: any) => {
      const state = {
        uuid: "different-user-uuid",
        reSetUser: jest.fn(),
      }
      return selector(state)
    })

    render(<ViewProfileTemplate {...propsWithNoRoles} />)

    expect(screen.queryByTestId("contact-button")).not.toBeInTheDocument()
  })

  it("should display professional info without company when company is null", () => {
    const propsWithoutCompany = {
      ...mockProps,
      company: null,
    }

    render(<ViewProfileTemplate {...propsWithoutCompany} />)

    expect(screen.getAllByText("Senior Developer")[0]).toBeInTheDocument()
    expect(screen.queryByText("@ Tech Corp")).not.toBeInTheDocument()
  })

  it("should not display location when location is null", () => {
    const propsWithoutLocation = {
      ...mockProps,
      location: null,
    }

    render(<ViewProfileTemplate {...propsWithoutLocation} />)

    expect(screen.queryByText("Ontario - Toronto")).not.toBeInTheDocument()
    expect(screen.queryByTestId("location-icon")).not.toBeInTheDocument()
  })

  it("should display location when provided", () => {
    render(<ViewProfileTemplate {...mockProps} />)

    expect(screen.getAllByText("Ontario - Toronto")[0]).toBeInTheDocument()
    expect(screen.getAllByTestId("location-icon")[0]).toBeInTheDocument()
  })
})
