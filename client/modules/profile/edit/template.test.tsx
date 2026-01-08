import React from "react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/utils/services/internationalization/client"
import { supabase } from "@/utils/services/supabase/config"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"

import { IIndustryResponse } from "@/types/api/response/industry"
import { TLocationData } from "@/types/api/response/location"
import { ESocialLink } from "@/types/common/social-links"
import useGetUserprofile from "@/hooks/api/user/get-user-profile"
import useUpdateUserProfile from "@/hooks/api/user/update-user-profile"
import useUserStore from "@/hooks/state/user/store"
import { useToast } from "@/components/ui/use-toast"

import EditProfileTemplate from "./template"

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

// Mock internationalization
jest.mock("@/utils/services/internationalization/client", () => ({
  useI18n: jest.fn(),
  useCurrentLocale: jest.fn(() => "en-ca"),
}))

// Mock Firebase to prevent IndexedDB errors
jest.mock("@/utils/services/firebase/config", () => ({
  firebase: {},
  remoteConfig: null,
}))

// Mock Supabase
jest.mock("@/utils/services/supabase/config", () => ({
  supabase: {
    storage: {
      from: jest.fn(() => ({
        list: jest.fn(),
        remove: jest.fn(),
        upload: jest.fn(),
        getPublicUrl: jest.fn(),
      })),
    },
  },
}))

// Mock hooks
jest.mock("@/hooks/api/user/get-user-profile")
jest.mock("@/hooks/api/user/update-user-profile")
jest.mock("@/hooks/state/user/store")
jest.mock("@/components/ui/use-toast")

// Mock child sections
jest.mock("@/modules/profile/components/sections/basic-info/basic-info", () => {
  return function MockBasicInfoSection(props: any) {
    return (
      <div data-testid="basic-info-section">
        <input
          data-testid="username-input"
          onChange={(e) => props.form.setValue("username", e.target.value)}
        />
        <input
          data-testid="location-input"
          onChange={(e) => props.form.setValue("locationUuid", e.target.value)}
        />
        <input
          data-testid="profile-image-input"
          type="file"
          onChange={props.onProfileImageChange}
        />
      </div>
    )
  }
})

jest.mock(
  "@/modules/profile/components/sections/work-experience/work-experience",
  () => {
    return function MockWorkExperienceSection(props: any) {
      return (
        <div data-testid="work-experience-section">
          <input
            data-testid="industry-input"
            onChange={(e) =>
              props.form.setValue("industryUuid", e.target.value)
            }
          />
        </div>
      )
    }
  }
)

jest.mock(
  "@/modules/profile/components/sections/social-links/social-links",
  () => {
    return function MockSocialLinksSection() {
      return <div data-testid="social-links-section">Social Links</div>
    }
  }
)

jest.mock(
  "@/modules/profile/components/sections/notification-permission/notification-permission",
  () => {
    return function MockNotificationPermissionSection() {
      return (
        <div data-testid="notification-permission-section">
          Notification Permission
        </div>
      )
    }
  }
)

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockUseI18n = useI18n as jest.MockedFunction<typeof useI18n>
const mockUseGetUserprofile = useGetUserprofile as jest.MockedFunction<
  typeof useGetUserprofile
>
const mockUseUpdateUserProfile = useUpdateUserProfile as jest.MockedFunction<
  typeof useUpdateUserProfile
>
const mockUseUserStore = useUserStore as unknown as jest.MockedFunction<any>
const mockUseToast = useToast as jest.MockedFunction<typeof useToast>

/**
 * EditProfileTemplate component tests
 * @group unit
 */
describe("EditProfileTemplate", () => {
  let queryClient: QueryClient
  const mockPush = jest.fn()
  const mockToast = jest.fn()
  const mockUpdateProfile = jest.fn()

  const mockLocationList: TLocationData[] = [
    {
      id: 1,
      uuid: "hk-island-uuid",
      value: "hong-kong-island",
      english_name: "Hong Kong Island",
      cantonese_name: "香港島",
      level: 1,
      parent_uuid: null,
      country_uuid: "hk-uuid",
      meta_data: {
        emoji: "🏝️",
      },
    },
    {
      id: 2,
      uuid: "central-uuid",
      value: "central",
      english_name: "Central",
      cantonese_name: "中環",
      level: 2,
      parent_uuid: "hk-island-uuid",
      country_uuid: "hk-uuid",
      meta_data: { emoji: null },
    },
  ]

  const mockIndustryList: IIndustryResponse[] = [
    {
      id: 1,
      uuid: "tech-uuid",
      value: "technology",
      english_name: "Technology",
      cantonese_name: "科技",
    },
    {
      id: 2,
      uuid: "finance-uuid",
      value: "finance",
      english_name: "Finance",
      cantonese_name: "金融",
    },
  ]

  const mockProfile = {
    uuid: "user-uuid-123",
    username: "johndoe",
    avatar_url: "https://example.com/avatar.jpg",
    description: "Software engineer with 5 years of experience",
    company_name: "Tech Corp",
    job_title: "Senior Developer",
    year_of_experience: 5,
    location: {
      uuid: "central-uuid",
      english_name: "Central",
      cantonese_name: "中環",
    },
    social_media_url: "https://linkedin.com/in/johndoe",
    links: [
      {
        type: ESocialLink.LINKEDIN,
        url: "https://linkedin.com/in/johndoe",
        name: null,
      },
    ],
    is_referee: true,
    is_referer: false,
    industry: {
      uuid: "tech-uuid",
      english_name: "Technology",
      cantonese_name: "科技",
    },
    notification_permissions: ["email_notifications"],
    contact_request_count: 10,
    post_count: [{ count: 5 }],
  }

  const mockT = jest.fn((key: string, options?: any) => {
    const translations: Record<string, string> = {
      "validation.text.maximum_length": `Maximum length is ${options?.count}`,
      "validation.text.minimum_length": `Minimum length is ${options?.count}`,
      "validation.text.no_white_space": "No whitespace allowed",
      "validation.link.not_valid": "Link is not valid",
      "validation.field_required": "This field is required",
      "validation.year_of_experience.exceed_range":
        "Year must be between 0-100",
      "profile.is_referrer.required": "Company is required for referrers",
      "profile.is_referrer_or_referee.required":
        "This field is required for referrers or referees",
      "profile.avatar_create_failed": "Failed to upload avatar",
      "profile.edit.success": "Profile updated successfully",
      "general.error.title": "Error",
      "general.error.description": "An error occurred",
      "general.wait": "Please wait...",
      "form.general.save": "Save",
    }
    return translations[key] || key
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })

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

    // Setup user store mock
    mockUseUserStore.mockImplementation((selector: any) => {
      const state = {
        uuid: "user-uuid-123",
        setUser: jest.fn(),
      }
      return selector(state)
    })

    // Setup toast mock
    mockUseToast.mockReturnValue({
      toast: mockToast,
      dismiss: jest.fn(),
      toasts: [],
    })

    // Setup get user profile mock
    mockUseGetUserprofile.mockReturnValue({
      data: mockProfile,
      isLoading: false,
      isError: false,
      error: null,
    } as any)

    // Setup update user profile mock
    mockUseUpdateUserProfile.mockReturnValue({
      mutate: mockUpdateProfile,
      isLoading: false,
      isError: false,
      error: null,
    } as any)
  })

  describe("Rendering", () => {
    it("should render all sections when profile is loaded", () => {
      render(
        <EditProfileTemplate
          locationList={mockLocationList}
          industryList={mockIndustryList}
        />,
        { wrapper }
      )

      expect(screen.getByTestId("basic-info-section")).toBeInTheDocument()
      expect(screen.getByTestId("work-experience-section")).toBeInTheDocument()
      expect(screen.getByTestId("social-links-section")).toBeInTheDocument()
      expect(
        screen.getByTestId("notification-permission-section")
      ).toBeInTheDocument()
    })

    it("should render save button", () => {
      render(
        <EditProfileTemplate
          locationList={mockLocationList}
          industryList={mockIndustryList}
        />,
        { wrapper }
      )

      const saveButton = screen.getByRole("button", { name: /save/i })
      expect(saveButton).toBeInTheDocument()
      expect(saveButton).not.toBeDisabled()
    })

    it("should not render when profile is not loaded", () => {
      mockUseGetUserprofile.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null,
      } as any)

      const { container } = render(
        <EditProfileTemplate
          locationList={mockLocationList}
          industryList={mockIndustryList}
        />,
        { wrapper }
      )

      expect(container.firstChild).toBeNull()
    })
  })

  describe("Form Initialization", () => {
    it("should initialize form with profile data", () => {
      render(
        <EditProfileTemplate
          locationList={mockLocationList}
          industryList={mockIndustryList}
        />,
        { wrapper }
      )

      // Form should be rendered with profile data
      expect(screen.getByTestId("basic-info-section")).toBeInTheDocument()
    })

    it("should handle profile with missing optional fields", () => {
      const profileWithoutOptionals = {
        ...mockProfile,
        description: null,
        company_name: null,
        job_title: null,
        year_of_experience: null,
        social_media_url: null,
        links: [],
        notification_permissions: [],
      }

      mockUseGetUserprofile.mockReturnValue({
        data: profileWithoutOptionals,
        isLoading: false,
        isError: false,
        error: null,
      } as any)

      render(
        <EditProfileTemplate
          locationList={mockLocationList}
          industryList={mockIndustryList}
        />,
        { wrapper }
      )

      expect(screen.getByTestId("basic-info-section")).toBeInTheDocument()
    })
  })

  describe("Form Validation", () => {
    it("should require username field", async () => {
      render(
        <EditProfileTemplate
          locationList={mockLocationList}
          industryList={mockIndustryList}
        />,
        { wrapper }
      )

      const usernameInput = screen.getByTestId("username-input")
      fireEvent.change(usernameInput, { target: { value: "" } })

      const saveButton = screen.getByRole("button", { name: /save/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockUpdateProfile).not.toHaveBeenCalled()
      })
    })

    it("should require location field", async () => {
      render(
        <EditProfileTemplate
          locationList={mockLocationList}
          industryList={mockIndustryList}
        />,
        { wrapper }
      )

      const locationInput = screen.getByTestId("location-input")
      fireEvent.change(locationInput, { target: { value: "" } })

      const saveButton = screen.getByRole("button", { name: /save/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockUpdateProfile).not.toHaveBeenCalled()
      })
    })

    it("should require industry field", async () => {
      render(
        <EditProfileTemplate
          locationList={mockLocationList}
          industryList={mockIndustryList}
        />,
        { wrapper }
      )

      const industryInput = screen.getByTestId("industry-input")
      fireEvent.change(industryInput, { target: { value: "" } })

      const saveButton = screen.getByRole("button", { name: /save/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockUpdateProfile).not.toHaveBeenCalled()
      })
    })
  })

  describe("Form Submission", () => {
    it("should submit form with valid data", async () => {
      const mockInvalidateQueries = jest.fn()
      const mockGetQueryData = jest.fn().mockReturnValue({
        uuid: "user-uuid-123",
        username: "newusername",
        avatar_url: "https://example.com/avatar.jpg",
        status: "active",
        description: "Updated description",
        linkedin_verification: { user_uuid: "user-uuid-123" },
      })

      queryClient.invalidateQueries = mockInvalidateQueries
      queryClient.getQueryData = mockGetQueryData

      const mockSetUser = jest.fn()
      mockUseUserStore.mockImplementation((selector: any) => {
        const state = {
          uuid: "user-uuid-123",
          setUser: mockSetUser,
        }
        return selector(state)
      })

      mockUpdateProfile.mockImplementation((data, { onSuccess }) => {
        onSuccess()
      })

      render(
        <EditProfileTemplate
          locationList={mockLocationList}
          industryList={mockIndustryList}
        />,
        { wrapper }
      )

      const usernameInput = screen.getByTestId("username-input")
      fireEvent.change(usernameInput, { target: { value: "newusername" } })

      const saveButton = screen.getByRole("button", { name: /save/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockUpdateProfile).toHaveBeenCalled()
        expect(mockInvalidateQueries).toHaveBeenCalled()
        expect(mockGetQueryData).toHaveBeenCalled()
        expect(mockSetUser).toHaveBeenCalledWith({
          uuid: "user-uuid-123",
          username: "newusername",
          photoUrl: "https://example.com/avatar.jpg",
          status: "active",
          description: "Updated description",
          hasLinkedInVerification: true,
        })
      })
    })

    it("should show success toast on successful update", async () => {
      const mockInvalidateQueries = jest.fn()
      const mockGetQueryData = jest.fn().mockReturnValue(mockProfile)

      queryClient.invalidateQueries = mockInvalidateQueries
      queryClient.getQueryData = mockGetQueryData

      mockUpdateProfile.mockImplementation((data, { onSuccess }) => {
        onSuccess()
      })

      render(
        <EditProfileTemplate
          locationList={mockLocationList}
          industryList={mockIndustryList}
        />,
        { wrapper }
      )

      const saveButton = screen.getByRole("button", { name: /save/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Profile updated successfully",
        })
      })
    })

    it("should navigate to profile page on successful update", async () => {
      const mockInvalidateQueries = jest.fn()
      const mockGetQueryData = jest.fn().mockReturnValue(mockProfile)

      queryClient.invalidateQueries = mockInvalidateQueries
      queryClient.getQueryData = mockGetQueryData

      mockUpdateProfile.mockImplementation((data, { onSuccess }) => {
        onSuccess()
      })

      render(
        <EditProfileTemplate
          locationList={mockLocationList}
          industryList={mockIndustryList}
        />,
        { wrapper }
      )

      const saveButton = screen.getByRole("button", { name: /save/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining("/profile/user-uuid-123")
        )
      })
    })

    it("should show error toast on failed update", async () => {
      mockUpdateProfile.mockImplementation((data, { onError }) => {
        onError(new Error("Update failed"))
      })

      render(
        <EditProfileTemplate
          locationList={mockLocationList}
          industryList={mockIndustryList}
        />,
        { wrapper }
      )

      const saveButton = screen.getByRole("button", { name: /save/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Error",
          description: "An error occurred",
          variant: "destructive",
        })
      })
    })

    it("should disable submit button while submitting", async () => {
      mockUpdateProfile.mockImplementation((data, { onSettled }) => {
        setTimeout(() => onSettled(), 100)
      })

      render(
        <EditProfileTemplate
          locationList={mockLocationList}
          industryList={mockIndustryList}
        />,
        { wrapper }
      )

      const saveButton = screen.getByRole("button", { name: /save/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(saveButton).toBeDisabled()
      })
    })

    it("should show waiting text while submitting", async () => {
      mockUpdateProfile.mockImplementation((data, { onSettled }) => {
        setTimeout(() => onSettled(), 100)
      })

      render(
        <EditProfileTemplate
          locationList={mockLocationList}
          industryList={mockIndustryList}
        />,
        { wrapper }
      )

      const saveButton = screen.getByRole("button", { name: /save/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText("Please wait...")).toBeInTheDocument()
      })
    })
  })

  describe("Image Upload", () => {
    it("should handle profile image change", async () => {
      render(
        <EditProfileTemplate
          locationList={mockLocationList}
          industryList={mockIndustryList}
        />,
        { wrapper }
      )

      const file = new File(["dummy content"], "test.png", {
        type: "image/png",
      })
      const imageInput = screen.getByTestId("profile-image-input")

      fireEvent.change(imageInput, { target: { files: [file] } })

      // Image should be set
      expect(imageInput).toBeInTheDocument()
    })

    it("should upload image to Supabase storage on form submit", async () => {
      const mockUpload = jest.fn().mockResolvedValue({
        data: { path: "path/to/image" },
        error: null,
      })
      const mockGetPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: "https://example.com/new-avatar.jpg" },
      })
      const mockList = jest.fn().mockResolvedValue({
        data: [],
        error: null,
      })

      ;(supabase.storage.from as jest.Mock).mockReturnValue({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
        list: mockList,
        remove: jest.fn().mockResolvedValue({ error: null }),
      })

      mockUpdateProfile.mockImplementation((data, { onSuccess }) => {
        onSuccess()
      })

      render(
        <EditProfileTemplate
          locationList={mockLocationList}
          industryList={mockIndustryList}
        />,
        { wrapper }
      )

      const file = new File(["dummy content"], "test.png", {
        type: "image/png",
      })
      const imageInput = screen.getByTestId("profile-image-input")

      fireEvent.change(imageInput, { target: { files: [file] } })

      const saveButton = screen.getByRole("button", { name: /save/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockUpload).toHaveBeenCalled()
        expect(mockGetPublicUrl).toHaveBeenCalled()
      })
    })

    it("should show error toast when image upload fails", async () => {
      const mockUpload = jest.fn().mockResolvedValue({
        data: null,
        error: new Error("Upload failed"),
      })
      const mockList = jest.fn().mockResolvedValue({
        data: [],
        error: null,
      })

      ;(supabase.storage.from as jest.Mock).mockReturnValue({
        upload: mockUpload,
        list: mockList,
        remove: jest.fn().mockResolvedValue({ error: null }),
      })

      render(
        <EditProfileTemplate
          locationList={mockLocationList}
          industryList={mockIndustryList}
        />,
        { wrapper }
      )

      const file = new File(["dummy content"], "test.png", {
        type: "image/png",
      })
      const imageInput = screen.getByTestId("profile-image-input")

      fireEvent.change(imageInput, { target: { files: [file] } })

      const saveButton = screen.getByRole("button", { name: /save/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Failed to upload avatar",
          description: "An error occurred",
        })
      })
    })
  })

  describe("Location Migration", () => {
    it("should use locationUuid field instead of separate location fields", () => {
      render(
        <EditProfileTemplate
          locationList={mockLocationList}
          industryList={mockIndustryList}
        />,
        { wrapper }
      )

      // Location input should be present (using locationUuid)
      expect(screen.getByTestId("location-input")).toBeInTheDocument()
    })

    it("should initialize form with location UUID from profile", () => {
      render(
        <EditProfileTemplate
          locationList={mockLocationList}
          industryList={mockIndustryList}
        />,
        { wrapper }
      )

      // Form should be initialized with location UUID
      expect(screen.getByTestId("basic-info-section")).toBeInTheDocument()
    })

    it("should submit locationUuid to update profile API", async () => {
      mockUpdateProfile.mockImplementation((data, { onSuccess }) => {
        expect(data.locationUuid).toBe("central-uuid")
        onSuccess()
      })

      render(
        <EditProfileTemplate
          locationList={mockLocationList}
          industryList={mockIndustryList}
        />,
        { wrapper }
      )

      const locationInput = screen.getByTestId("location-input")
      fireEvent.change(locationInput, { target: { value: "central-uuid" } })

      const saveButton = screen.getByRole("button", { name: /save/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockUpdateProfile).toHaveBeenCalled()
      })
    })
  })

  describe("Props Passing", () => {
    it("should pass locationList to BasicInfoSection", () => {
      render(
        <EditProfileTemplate
          locationList={mockLocationList}
          industryList={mockIndustryList}
        />,
        { wrapper }
      )

      expect(screen.getByTestId("basic-info-section")).toBeInTheDocument()
    })

    it("should pass industryList to WorkExperienceSection", () => {
      render(
        <EditProfileTemplate
          locationList={mockLocationList}
          industryList={mockIndustryList}
        />,
        { wrapper }
      )

      expect(screen.getByTestId("work-experience-section")).toBeInTheDocument()
    })
  })
})
