import React from "react"
import {
  useCurrentLocale,
  useI18n,
} from "@/utils/services/internationalization/client"
import { fireEvent, render, screen } from "@testing-library/react"
import { useForm } from "react-hook-form"

import { TLocationData } from "@/types/api/response/location"
import { IUserResponse } from "@/types/api/response/user"
import { ELocale } from "@/types/common/enums/locale"
import { ESocialLink } from "@/types/common/social-links"
import useLocationOptionsList from "@/hooks/common/options/location-options-list"

import BasicInfoSection from "./basic-info"

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

// Mock Supabase
jest.mock("@/utils/services/supabase/config", () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getSession: jest.fn(),
    },
  },
}))

// Mock hooks
jest.mock("@/hooks/common/options/location-options-list")

// Mock child components
jest.mock("@/modules/profile/components/sections/base/base", () => {
  return function MockBaseSection({ title, children }: any) {
    return (
      <div data-testid="base-section">
        <h2 data-testid="section-title">{title}</h2>
        {children}
      </div>
    )
  }
})

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
        Avatar
      </div>
    )
  }
})

jest.mock("@/components/customized-ui/form/file", () => {
  return function MockFormFileUpload({ accept, onChange, description }: any) {
    return (
      <div data-testid="form-file-upload">
        <input
          type="file"
          accept={accept}
          onChange={onChange}
          data-testid="file-input"
        />
        <span data-testid="file-description">{description}</span>
      </div>
    )
  }
})

jest.mock("@/components/customized-ui/form/input", () => {
  return function MockFormTextInput({ control, name }: any) {
    return (
      <input data-testid={`input-${name}`} name={name} placeholder={name} />
    )
  }
})

jest.mock("@/components/customized-ui/form/check-box", () => {
  return function MockFormCheckBox({ control, label, name, description }: any) {
    return (
      <div data-testid={`checkbox-${name}`}>
        <label data-testid={`checkbox-label-${name}`}>{label}</label>
        <span data-testid={`checkbox-description-${name}`}>{description}</span>
      </div>
    )
  }
})

jest.mock("@/components/customized-ui/form/select", () => {
  return function MockFormSelect({ control, name, options }: any) {
    return (
      <select data-testid={`select-${name}`} name={name}>
        {options?.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    )
  }
})

jest.mock("@/components/customized-ui/form/text-area", () => {
  return function MockFormTextArea({ control, name, minRows }: any) {
    return (
      <textarea
        data-testid={`textarea-${name}`}
        name={name}
        rows={minRows}
        placeholder={name}
      />
    )
  }
})

const mockUseI18n = useI18n as jest.MockedFunction<typeof useI18n>
const mockUseCurrentLocale = useCurrentLocale as jest.MockedFunction<
  typeof useCurrentLocale
>
const mockUseLocationOptionsList =
  useLocationOptionsList as jest.MockedFunction<typeof useLocationOptionsList>

// Wrapper component to provide form context
function TestWrapper({ children, defaultValues = {} }: any) {
  const form = useForm({ defaultValues })
  return <div>{children(form)}</div>
}

/**
 * BasicInfoSection component tests
 * @group unit
 */
describe("BasicInfoSection", () => {
  const mockOnProfileImageChange = jest.fn()

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

  const mockProfile: IUserResponse = {
    uuid: "user-uuid-123",
    email: "johndoe@example.com",
    username: "johndoe",
    status: "active",
    role: "user",
    avatar_url: "https://example.com/avatar.jpg",
    description: "Software engineer with 5 years of experience",
    company_name: "Tech Corp",
    job_title: "Senior Developer",
    year_of_experience: 5,
    industry_uuid: "tech-uuid",
    industry: {
      uuid: "tech-uuid",
      english_name: "Technology",
      cantonese_name: "科技",
    },
    location: {
      uuid: "central-uuid",
      english_name: "Central",
      cantonese_name: "中環",
    },
    location_uuid: "central-uuid",
    social_media_url: "https://linkedin.com/in/johndoe",
    is_referer: false,
    is_referee: true,
    contact_request_count: 10,
    links: [
      {
        type: ESocialLink.LINKEDIN,
        url: "https://linkedin.com/in/johndoe",
        name: null,
      },
    ],
    notification_permissions: ["email_notifications"],
    post_count: [{ count: 5 }],
    linkedin_verification: null,
  }

  const mockT = jest.fn((key: string) => {
    const translations: Record<string, string> = {
      "profile.section.basic_info": "Basic Information",
      "profile.form.avatar_label": "Avatar",
      "profile.form.avatar_description": "Upload your avatar",
      "auth.form.username_label": "Username",
      "general.user_role": "User Role",
      "general.referrer": "Referrer",
      "general.talent": "Talent",
      "general.location": "Location",
      "profile.form.is_referrer_description": "I can refer others",
      "profile.form.is_referee_description": "I am looking for opportunities",
      "profile.form.personal_description_label": "Personal Description",
    }
    return translations[key] || key
  })

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup i18n mock
    mockUseI18n.mockReturnValue(mockT)

    // Setup locale mock
    mockUseCurrentLocale.mockReturnValue(ELocale.EN_CA)

    // Setup location options mock
    mockUseLocationOptionsList.mockReturnValue(mockLocationOptions)
  })

  describe("Rendering", () => {
    it("should render base section with title", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <BasicInfoSection
              base64Image={null}
              onProfileImageChange={mockOnProfileImageChange}
              profile={mockProfile}
              form={form}
              locationList={mockLocationList}
              isReferrerChecked={false}
              isRefereeChecked={false}
            />
          )}
        </TestWrapper>
      )

      expect(screen.getByTestId("base-section")).toBeInTheDocument()
      expect(screen.getByTestId("section-title")).toHaveTextContent(
        "Basic Information"
      )
    })

    it("should render avatar section", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <BasicInfoSection
              base64Image=""
              onProfileImageChange={mockOnProfileImageChange}
              profile={mockProfile}
              form={form}
              locationList={mockLocationList}
              isReferrerChecked={false}
              isRefereeChecked={false}
            />
          )}
        </TestWrapper>
      )

      const avatarTexts = screen.getAllByText("Avatar")
      expect(avatarTexts.length).toBeGreaterThan(0)
      expect(screen.getByTestId("base-avatar")).toBeInTheDocument()
      expect(screen.getByTestId("form-file-upload")).toBeInTheDocument()
    })

    it("should render username input", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <BasicInfoSection
              base64Image={null}
              onProfileImageChange={mockOnProfileImageChange}
              profile={mockProfile}
              form={form}
              locationList={mockLocationList}
              isReferrerChecked={false}
              isRefereeChecked={false}
            />
          )}
        </TestWrapper>
      )

      expect(screen.getByText("Username")).toBeInTheDocument()
      expect(screen.getByTestId("input-username")).toBeInTheDocument()
    })

    it("should render user role checkboxes", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <BasicInfoSection
              base64Image={null}
              onProfileImageChange={mockOnProfileImageChange}
              profile={mockProfile}
              form={form}
              locationList={mockLocationList}
              isReferrerChecked={false}
              isRefereeChecked={false}
            />
          )}
        </TestWrapper>
      )

      expect(screen.getByText("User Role")).toBeInTheDocument()
      expect(screen.getByTestId("checkbox-isReferer")).toBeInTheDocument()
      expect(screen.getByTestId("checkbox-isReferee")).toBeInTheDocument()
      expect(screen.getByText("Referrer")).toBeInTheDocument()
      expect(screen.getByText("Talent")).toBeInTheDocument()
    })

    it("should render location select", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <BasicInfoSection
              base64Image={null}
              onProfileImageChange={mockOnProfileImageChange}
              profile={mockProfile}
              form={form}
              locationList={mockLocationList}
              isReferrerChecked={false}
              isRefereeChecked={false}
            />
          )}
        </TestWrapper>
      )

      expect(screen.getByText("Location")).toBeInTheDocument()
      expect(screen.getByTestId("select-locationUuid")).toBeInTheDocument()
    })

    it("should render description textarea", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <BasicInfoSection
              base64Image={null}
              onProfileImageChange={mockOnProfileImageChange}
              profile={mockProfile}
              form={form}
              locationList={mockLocationList}
              isReferrerChecked={false}
              isRefereeChecked={false}
            />
          )}
        </TestWrapper>
      )

      expect(screen.getByText("Personal Description")).toBeInTheDocument()
      expect(screen.getByTestId("textarea-description")).toBeInTheDocument()
    })
  })

  describe("Avatar Handling", () => {
    it("should display profile avatar when no base64Image provided", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <BasicInfoSection
              base64Image={null}
              onProfileImageChange={mockOnProfileImageChange}
              profile={mockProfile}
              form={form}
              locationList={mockLocationList}
              isReferrerChecked={false}
              isRefereeChecked={false}
            />
          )}
        </TestWrapper>
      )

      const avatar = screen.getByTestId("base-avatar")
      expect(avatar).toHaveAttribute(
        "data-url",
        "https://example.com/avatar.jpg"
      )
      expect(avatar).toHaveAttribute("data-alt", "johndoe")
    })

    it("should display base64Image when provided", () => {
      const base64Image =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

      render(
        <TestWrapper>
          {(form: any) => (
            <BasicInfoSection
              base64Image={base64Image}
              onProfileImageChange={mockOnProfileImageChange}
              profile={mockProfile}
              form={form}
              locationList={mockLocationList}
              isReferrerChecked={false}
              isRefereeChecked={false}
            />
          )}
        </TestWrapper>
      )

      const avatar = screen.getByTestId("base-avatar")
      expect(avatar).toHaveAttribute("data-url", base64Image)
    })

    it("should call onProfileImageChange when file is selected", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <BasicInfoSection
              base64Image={null}
              onProfileImageChange={mockOnProfileImageChange}
              profile={mockProfile}
              form={form}
              locationList={mockLocationList}
              isReferrerChecked={false}
              isRefereeChecked={false}
            />
          )}
        </TestWrapper>
      )

      const fileInput = screen.getByTestId("file-input")
      const file = new File(["dummy content"], "test.png", {
        type: "image/png",
      })

      fireEvent.change(fileInput, { target: { files: [file] } })

      expect(mockOnProfileImageChange).toHaveBeenCalled()
    })
  })

  describe("Location Migration", () => {
    it("should call useLocationOptionsList with correct parameters", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <BasicInfoSection
              base64Image={null}
              onProfileImageChange={mockOnProfileImageChange}
              profile={mockProfile}
              form={form}
              locationList={mockLocationList}
              isReferrerChecked={false}
              isRefereeChecked={false}
            />
          )}
        </TestWrapper>
      )

      expect(mockUseLocationOptionsList).toHaveBeenCalledWith(
        mockLocationList,
        false,
        ELocale.EN_CA
      )
    })

    it("should render location select with hierarchical options", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <BasicInfoSection
              base64Image={null}
              onProfileImageChange={mockOnProfileImageChange}
              profile={mockProfile}
              form={form}
              locationList={mockLocationList}
              isReferrerChecked={false}
              isRefereeChecked={false}
            />
          )}
        </TestWrapper>
      )

      const locationSelect = screen.getByTestId("select-locationUuid")
      expect(locationSelect).toBeInTheDocument()

      // Check that options are rendered
      const options = locationSelect.querySelectorAll("option")
      expect(options.length).toBe(2)
      expect(options[0]).toHaveTextContent("🏝️ Hong Kong Island")
      expect(options[1]).toHaveTextContent("Hong Kong Island - Central")
    })

    it("should use locationUuid field name for location select", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <BasicInfoSection
              base64Image={null}
              onProfileImageChange={mockOnProfileImageChange}
              profile={mockProfile}
              form={form}
              locationList={mockLocationList}
              isReferrerChecked={false}
              isRefereeChecked={false}
            />
          )}
        </TestWrapper>
      )

      const locationSelect = screen.getByTestId("select-locationUuid")
      expect(locationSelect).toHaveAttribute("name", "locationUuid")
    })
  })

  describe("User Role Styling", () => {
    it("should apply orange background when referrer is checked", () => {
      const { container } = render(
        <TestWrapper>
          {(form: any) => (
            <BasicInfoSection
              base64Image={null}
              onProfileImageChange={mockOnProfileImageChange}
              profile={mockProfile}
              form={form}
              locationList={mockLocationList}
              isReferrerChecked={true}
              isRefereeChecked={false}
            />
          )}
        </TestWrapper>
      )

      const referrerCheckbox = screen.getByTestId("checkbox-isReferer")
      const referrerContainer = referrerCheckbox.parentElement
      expect(referrerContainer).toHaveClass("bg-orange-50")
    })

    it("should apply teal background when referee is checked", () => {
      const { container } = render(
        <TestWrapper>
          {(form: any) => (
            <BasicInfoSection
              base64Image={null}
              onProfileImageChange={mockOnProfileImageChange}
              profile={mockProfile}
              form={form}
              locationList={mockLocationList}
              isReferrerChecked={false}
              isRefereeChecked={true}
            />
          )}
        </TestWrapper>
      )

      const refereeCheckbox = screen.getByTestId("checkbox-isReferee")
      const refereeContainer = refereeCheckbox.parentElement
      expect(refereeContainer).toHaveClass("bg-teal-50")
    })

    it("should apply white background when neither role is checked", () => {
      const { container } = render(
        <TestWrapper>
          {(form: any) => (
            <BasicInfoSection
              base64Image={null}
              onProfileImageChange={mockOnProfileImageChange}
              profile={mockProfile}
              form={form}
              locationList={mockLocationList}
              isReferrerChecked={false}
              isRefereeChecked={false}
            />
          )}
        </TestWrapper>
      )

      const referrerCheckbox = screen.getByTestId("checkbox-isReferer")
      const referrerContainer = referrerCheckbox.parentElement
      expect(referrerContainer).toHaveClass("bg-white")

      const refereeCheckbox = screen.getByTestId("checkbox-isReferee")
      const refereeContainer = refereeCheckbox.parentElement
      expect(refereeContainer).toHaveClass("bg-white")
    })
  })

  describe("Props Passing", () => {
    it("should pass correct props to file upload component", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <BasicInfoSection
              base64Image={null}
              onProfileImageChange={mockOnProfileImageChange}
              profile={mockProfile}
              form={form}
              locationList={mockLocationList}
              isReferrerChecked={false}
              isRefereeChecked={false}
            />
          )}
        </TestWrapper>
      )

      const fileInput = screen.getByTestId("file-input")
      expect(fileInput).toHaveAttribute("accept", ".jpg, .jpeg, .png")
      expect(screen.getByTestId("file-description")).toHaveTextContent(
        "Upload your avatar"
      )
    })

    it("should pass locationList to useLocationOptionsList hook", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <BasicInfoSection
              base64Image={null}
              onProfileImageChange={mockOnProfileImageChange}
              profile={mockProfile}
              form={form}
              locationList={mockLocationList}
              isReferrerChecked={false}
              isRefereeChecked={false}
            />
          )}
        </TestWrapper>
      )

      expect(mockUseLocationOptionsList).toHaveBeenCalledWith(
        mockLocationList,
        expect.any(Boolean),
        expect.any(String)
      )
    })
  })
})
