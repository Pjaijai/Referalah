import React from "react"
import { useRouter } from "next/navigation"
import {
  useCurrentLocale,
  useI18n,
} from "@/utils/services/internationalization/client"
import { render, screen, waitFor } from "@testing-library/react"

import { TLocationData } from "@/types/api/response/location"
import { ELocale } from "@/types/common/enums/locale"
import { ESocialLink } from "@/types/common/social-links"
import { siteConfig } from "@/config/site"
import useGetUserprofile from "@/hooks/api/user/get-user-profile"
import useLocationOptionsList from "@/hooks/common/options/location-options-list"
import useUserStore from "@/hooks/state/user/store"

import ProfileTemplate from "./template"

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

// Mock internationalization
jest.mock("@/utils/services/internationalization/client", () => ({
  useI18n: jest.fn(),
  useCurrentLocale: jest.fn(),
}))

// Mock Firebase to prevent IndexedDB errors
jest.mock("@/utils/services/firebase/config", () => ({
  firebase: {},
  remoteConfig: null,
}))

// Mock Supabase to prevent jose module parsing errors
jest.mock("@/utils/services/supabase/config", () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getSession: jest.fn(),
    },
  },
}))

// Mock hooks
jest.mock("@/hooks/api/user/get-user-profile")
jest.mock("@/hooks/common/options/location-options-list")
jest.mock("@/hooks/state/user/store")

// Mock child components
jest.mock("@/modules/profile/view/template", () => {
  return function MockViewProfileTemplate(props: any) {
    return (
      <div data-testid="view-profile-template">
        <div data-testid="username">{props.username}</div>
        <div data-testid="photo-url">{props.photoUrl}</div>
        <div data-testid="description">{props.description}</div>
        <div data-testid="company">{props.company}</div>
        <div data-testid="job-title">{props.jobTitle}</div>
        <div data-testid="year-of-experience">{props.yearOfExperience}</div>
        <div data-testid="location">{props.location}</div>
        <div data-testid="industry">{props.industry}</div>
        <div data-testid="is-referee">{String(props.isReferee)}</div>
        <div data-testid="is-referer">{String(props.isReferer)}</div>
        <div data-testid="slug">{props.slug}</div>
        <div data-testid="request-count">{props.requestCount}</div>
        <div data-testid="post-count">{props.postCount}</div>
      </div>
    )
  }
})

jest.mock("@/components/icons", () => ({
  Icons: {
    loader: ({ className }: any) => (
      <div data-testid="loader-icon" className={className}>
        Loading...
      </div>
    ),
  },
}))

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockUseI18n = useI18n as jest.MockedFunction<typeof useI18n>
const mockUseCurrentLocale = useCurrentLocale as jest.MockedFunction<
  typeof useCurrentLocale
>
const mockUseGetUserprofile = useGetUserprofile as jest.MockedFunction<
  typeof useGetUserprofile
>
const mockUseLocationOptionsList =
  useLocationOptionsList as jest.MockedFunction<typeof useLocationOptionsList>
const mockUseUserStore = useUserStore as unknown as jest.MockedFunction<any>

/**
 * ProfileTemplate component tests
 * @group unit
 */
describe("ProfileTemplate", () => {
  const mockPush = jest.fn()

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

  const mockLocationOptions = [
    { value: "hk-island-uuid", label: "🏝️ Hong Kong Island" },
    { value: "central-uuid", label: "Hong Kong Island - Central" },
  ]

  const mockProfile = {
    uuid: "user-uuid-123",
    username: "johndoe",
    avatar_url: "https://example.com/avatar.jpg",
    description: "Software engineer with 5 years of experience",
    company_name: "Tech Corp",
    job_title: "Senior Developer",
    year_of_experience: 5,
    location_uuid: "central-uuid",
    links: [
      {
        type: ESocialLink.LINKEDIN,
        url: "https://linkedin.com/in/johndoe",
        name: "LinkedIn Profile",
      },
    ],
    is_referee: true,
    is_referer: false,
    industry: {
      uuid: "tech-uuid",
      english_name: "Technology",
      cantonese_name: "科技",
    },
    contact_request_count: 10,
    post_count: [{ count: 5 }],
  }

  const mockT = jest.fn((key: string) => {
    const translations: Record<string, string> = {
      "profile.con_not_find_user": "Cannot find user. Please ",
      "general.sign_in": "sign in",
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

    // Setup locale mock - default to English
    mockUseCurrentLocale.mockReturnValue(ELocale.EN_CA)

    // Setup location options mock
    mockUseLocationOptionsList.mockReturnValue(mockLocationOptions)

    // Setup user store mock
    mockUseUserStore.mockImplementation((selector: any) => {
      const state = {
        uuid: "current-user-uuid",
      }
      return selector(state)
    })
  })

  describe("Loading States", () => {
    it("should display loader when data is loading", () => {
      mockUseGetUserprofile.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      } as any)

      render(
        <ProfileTemplate
          userUuid="user-uuid-123"
          locationList={mockLocationList}
        />
      )

      expect(screen.getByTestId("loader-icon")).toBeInTheDocument()
      expect(
        screen.queryByTestId("view-profile-template")
      ).not.toBeInTheDocument()
    })

    it("should display user not found message when no profile data and not loading", () => {
      mockUseGetUserprofile.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: null,
      } as any)

      render(
        <ProfileTemplate
          userUuid="user-uuid-123"
          locationList={mockLocationList}
        />
      )

      expect(screen.getByText("Cannot find user. Please")).toBeInTheDocument()
      expect(screen.getByText("sign in")).toBeInTheDocument()
      expect(
        screen.queryByTestId("view-profile-template")
      ).not.toBeInTheDocument()
    })

    it("should display user not found message when userUuid is not provided", () => {
      mockUseGetUserprofile.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
      } as any)

      render(
        <ProfileTemplate userUuid={undefined} locationList={mockLocationList} />
      )

      expect(screen.getByText("Cannot find user. Please")).toBeInTheDocument()
    })
  })

  describe("Profile Data Display", () => {
    beforeEach(() => {
      mockUseGetUserprofile.mockReturnValue({
        data: mockProfile,
        isLoading: false,
        isError: false,
        error: null,
      } as any)
    })

    it("should render ViewProfileTemplate with correct props when data is loaded", () => {
      render(
        <ProfileTemplate
          userUuid="user-uuid-123"
          locationList={mockLocationList}
        />
      )

      expect(screen.getByTestId("view-profile-template")).toBeInTheDocument()
      expect(screen.getByTestId("username")).toHaveTextContent("johndoe")
      expect(screen.getByTestId("photo-url")).toHaveTextContent(
        "https://example.com/avatar.jpg"
      )
      expect(screen.getByTestId("description")).toHaveTextContent(
        "Software engineer with 5 years of experience"
      )
      expect(screen.getByTestId("company")).toHaveTextContent("Tech Corp")
      expect(screen.getByTestId("job-title")).toHaveTextContent(
        "Senior Developer"
      )
      expect(screen.getByTestId("year-of-experience")).toHaveTextContent("5")
    })

    it("should display English industry name for English locale", () => {
      mockUseCurrentLocale.mockReturnValue(ELocale.EN_CA)

      render(
        <ProfileTemplate
          userUuid="user-uuid-123"
          locationList={mockLocationList}
        />
      )

      expect(screen.getByTestId("industry")).toHaveTextContent("Technology")
    })

    it("should display Cantonese industry name for zh-hk locale", () => {
      mockUseCurrentLocale.mockReturnValue(ELocale.ZH_HK)

      render(
        <ProfileTemplate
          userUuid="user-uuid-123"
          locationList={mockLocationList}
        />
      )

      expect(screen.getByTestId("industry")).toHaveTextContent("科技")
    })

    it("should display referee and referrer status correctly", () => {
      render(
        <ProfileTemplate
          userUuid="user-uuid-123"
          locationList={mockLocationList}
        />
      )

      expect(screen.getByTestId("is-referee")).toHaveTextContent("true")
      expect(screen.getByTestId("is-referer")).toHaveTextContent("false")
    })

    it("should display request and post counts correctly", () => {
      render(
        <ProfileTemplate
          userUuid="user-uuid-123"
          locationList={mockLocationList}
        />
      )

      expect(screen.getByTestId("request-count")).toHaveTextContent("10")
      expect(screen.getByTestId("post-count")).toHaveTextContent("5")
    })

    it("should pass correct slug to ViewProfileTemplate", () => {
      render(
        <ProfileTemplate
          userUuid="user-uuid-123"
          locationList={mockLocationList}
        />
      )

      expect(screen.getByTestId("slug")).toHaveTextContent("user-uuid-123")
    })
  })

  describe("Location Handling", () => {
    beforeEach(() => {
      mockUseGetUserprofile.mockReturnValue({
        data: mockProfile,
        isLoading: false,
        isError: false,
        error: null,
      } as any)
    })

    it("should call useLocationOptionsList with correct parameters", () => {
      mockUseCurrentLocale.mockReturnValue(ELocale.EN_CA)

      render(
        <ProfileTemplate
          userUuid="user-uuid-123"
          locationList={mockLocationList}
        />
      )

      expect(mockUseLocationOptionsList).toHaveBeenCalledWith(
        mockLocationList,
        false,
        ELocale.EN_CA
      )
    })

    it("should display hierarchical location label based on location_uuid", () => {
      render(
        <ProfileTemplate
          userUuid="user-uuid-123"
          locationList={mockLocationList}
        />
      )

      expect(screen.getByTestId("location")).toHaveTextContent(
        "Hong Kong Island - Central"
      )
    })

    it("should display null location when location_uuid is not in profile", () => {
      const profileWithoutLocation = {
        ...mockProfile,
        location_uuid: null,
      }

      mockUseGetUserprofile.mockReturnValue({
        data: profileWithoutLocation,
        isLoading: false,
        isError: false,
        error: null,
      } as any)

      render(
        <ProfileTemplate
          userUuid="user-uuid-123"
          locationList={mockLocationList}
        />
      )

      expect(screen.getByTestId("location")).toBeEmptyDOMElement()
    })

    it("should handle location_uuid not found in location options", () => {
      const profileWithInvalidLocation = {
        ...mockProfile,
        location_uuid: "invalid-uuid",
      }

      mockUseGetUserprofile.mockReturnValue({
        data: profileWithInvalidLocation,
        isLoading: false,
        isError: false,
        error: null,
      } as any)

      render(
        <ProfileTemplate
          userUuid="user-uuid-123"
          locationList={mockLocationList}
        />
      )

      expect(screen.getByTestId("location")).toBeEmptyDOMElement()
    })

    it("should update location when locale changes", () => {
      mockUseCurrentLocale.mockReturnValue(ELocale.ZH_HK)

      const cantonseLocationOptions = [
        { value: "hk-island-uuid", label: "🏝️ 香港島" },
        { value: "central-uuid", label: "香港島 - 中環" },
      ]

      mockUseLocationOptionsList.mockReturnValue(cantonseLocationOptions)

      render(
        <ProfileTemplate
          userUuid="user-uuid-123"
          locationList={mockLocationList}
        />
      )

      expect(screen.getByTestId("location")).toHaveTextContent("香港島 - 中環")
    })
  })

  describe("UUID Resolution", () => {
    it("should use provided userUuid when available", () => {
      mockUseGetUserprofile.mockReturnValue({
        data: mockProfile,
        isLoading: false,
        isError: false,
        error: null,
      } as any)

      render(
        <ProfileTemplate
          userUuid="provided-uuid"
          locationList={mockLocationList}
        />
      )

      expect(mockUseGetUserprofile).toHaveBeenCalledWith("provided-uuid")
    })

    it("should use userStoreUuid when userUuid is not provided", () => {
      mockUseUserStore.mockImplementation((selector: any) => {
        const state = {
          uuid: "store-uuid",
        }
        return selector(state)
      })

      mockUseGetUserprofile.mockReturnValue({
        data: mockProfile,
        isLoading: false,
        isError: false,
        error: null,
      } as any)

      render(
        <ProfileTemplate userUuid={undefined} locationList={mockLocationList} />
      )

      expect(mockUseGetUserprofile).toHaveBeenCalledWith("store-uuid")
    })

    it("should use null when neither userUuid nor userStoreUuid is available", () => {
      mockUseUserStore.mockImplementation((selector: any) => {
        const state = {
          uuid: null,
        }
        return selector(state)
      })

      mockUseGetUserprofile.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
      } as any)

      render(
        <ProfileTemplate userUuid={undefined} locationList={mockLocationList} />
      )

      expect(mockUseGetUserprofile).toHaveBeenCalledWith(null)
    })
  })

  describe("Edge Cases", () => {
    it("should handle profile without avatar_url", () => {
      const profileWithoutAvatar = {
        ...mockProfile,
        avatar_url: null,
      }

      mockUseGetUserprofile.mockReturnValue({
        data: profileWithoutAvatar,
        isLoading: false,
        isError: false,
        error: null,
      } as any)

      render(
        <ProfileTemplate
          userUuid="user-uuid-123"
          locationList={mockLocationList}
        />
      )

      expect(screen.getByTestId("photo-url")).toBeEmptyDOMElement()
    })

    it("should handle profile without industry", () => {
      const profileWithoutIndustry = {
        ...mockProfile,
        industry: null,
      }

      mockUseGetUserprofile.mockReturnValue({
        data: profileWithoutIndustry,
        isLoading: false,
        isError: false,
        error: null,
      } as any)

      render(
        <ProfileTemplate
          userUuid="user-uuid-123"
          locationList={mockLocationList}
        />
      )

      expect(screen.getByTestId("industry")).toBeEmptyDOMElement()
    })

    it("should handle empty location list", () => {
      mockUseLocationOptionsList.mockReturnValue([])
      mockUseGetUserprofile.mockReturnValue({
        data: mockProfile,
        isLoading: false,
        isError: false,
        error: null,
      } as any)

      render(<ProfileTemplate userUuid="user-uuid-123" locationList={[]} />)

      expect(screen.getByTestId("location")).toBeEmptyDOMElement()
    })

    it("should render sign in link with correct href", () => {
      mockUseGetUserprofile.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: null,
      } as any)

      render(
        <ProfileTemplate
          userUuid="user-uuid-123"
          locationList={mockLocationList}
        />
      )

      const signInLink = screen.getByText("sign in")
      expect(signInLink).toHaveAttribute("href", siteConfig.page.signIn.href)
    })
  })

  describe("Empty State Rendering", () => {
    it("should show loader when userUuid is provided and data is loading", () => {
      mockUseGetUserprofile.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
        error: null,
      } as any)

      render(
        <ProfileTemplate
          userUuid="user-uuid-123"
          locationList={mockLocationList}
        />
      )

      // Should show loader when loading with userUuid
      expect(screen.getByTestId("loader-icon")).toBeInTheDocument()
    })
  })
})
