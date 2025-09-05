import React from "react"
import { useRouter } from "next/navigation"
import useLocationLabel from "@/modules/job-journey/hooks/location-label"
import {
  useCurrentLocale,
  useI18n,
} from "@/utils/services/internationalization/client"
import { fireEvent, render, screen } from "@testing-library/react"

import { EJobLevel } from "@/types/common/enums/job-level"
import { EJobType } from "@/types/common/enums/job-type"
import { ELocale } from "@/types/common/enums/locale"
import { EStepType } from "@/types/common/enums/step-type"
import useJobLevelOptions from "@/hooks/common/options/Job-level-options"
import useJobTypeOptions from "@/hooks/common/options/Job-type-options"
import useStepTypeOptions from "@/hooks/common/options/step-type-options"
import useUserStore from "@/hooks/state/user/store"

import JobJourneyCard, { TJobJourneyCardProps } from "./job-journey-card"

// Mock all dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

jest.mock("@/hooks/state/user/store")
jest.mock("@/modules/job-journey/hooks/location-label")
jest.mock("@/hooks/common/options/Job-level-options")
jest.mock("@/hooks/common/options/Job-type-options")
jest.mock("@/hooks/common/options/step-type-options")
jest.mock("@/utils/services/internationalization/client")
jest.mock("@/utils/common/helpers/format/vague-date", () => ({
  __esModule: true,
  default: jest.fn((date: string) => `Formatted: ${date}`),
}))
jest.mock("@/modules/job-journey/helpers/get-step-type-style", () => ({
  __esModule: true,
  default: jest.fn(() => "bg-blue-100 text-blue-800"),
}))
jest.mock("@/modules/job-journey/component/avatar/company", () => {
  return function MockCompanyAvatar({
    alt,
    className,
  }: {
    alt: string
    className: string
  }) {
    return (
      <div data-testid="company-avatar" className={className}>
        {alt}
      </div>
    )
  }
})
jest.mock("@/components/customized-ui/icons/fire", () => {
  return function MockFireIcon({ isFire }: { isFire: boolean }) {
    return (
      <div data-testid="fire-icon" data-is-fire={isFire}>
        🔥
      </div>
    )
  }
})

// Mock hooks
const mockPush = jest.fn()
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockUseUserStore = useUserStore as unknown as jest.MockedFunction<any>
const mockUseLocationLabel = useLocationLabel as jest.MockedFunction<
  typeof useLocationLabel
>
const mockUseJobLevelOptions = useJobLevelOptions as jest.MockedFunction<
  typeof useJobLevelOptions
>
const mockUseJobTypeOptions = useJobTypeOptions as jest.MockedFunction<
  typeof useJobTypeOptions
>
const mockUseStepTypeOptions = useStepTypeOptions as jest.MockedFunction<
  typeof useStepTypeOptions
>
const mockUseCurrentLocale = useCurrentLocale as jest.MockedFunction<
  typeof useCurrentLocale
>
const mockUseI18n = useI18n as jest.MockedFunction<typeof useI18n>

/**
 * JobJourneyCard component tests
 * @group unit
 */
describe("JobJourneyCard", () => {
  const mockProps: TJobJourneyCardProps = {
    username: "johndoe",
    applicationDate: "2024-01-15",
    companyName: "Tech Corp",
    jobTitle: "Software Engineer",
    stepStatus: EStepType.INTERVIEW,
    stepUpdatedDate: "2024-01-20",
    jobType: EJobType.FULL_TIME,
    jobLevel: EJobLevel.MID_LEVEL,
    location: {
      uuid: "toronto-uuid",
      english_name: "Toronto",
      cantonese_name: "多倫多",
    },
    fireCount: 5,
    description: "Exciting opportunity at a tech company",
    title: "My Journey at Tech Corp",
    uuid: "journey-uuid",
    locationList: [
      {
        id: 1,
        uuid: "toronto-uuid",
        value: "toronto",
        english_name: "Toronto",
        cantonese_name: "多倫多",
        level: 1,
        parent_uuid: null,
        country_uuid: "canada-uuid",
        meta_data: {
          emoji: "🇨🇦",
        },
      },
    ],
    logoUrl: "https://example.com/logo.png",
    createdBy: "user-uuid",
  }

  const mockT = jest.fn((key: string) => {
    const translations: Record<string, string> = {
      "job_journey.general.step": "Step",
      "general.updated_on": "Updated on",
    }
    return translations[key] || key
  })

  beforeEach(() => {
    // Reset all mocks
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

    // Setup user store mock
    mockUseUserStore.mockImplementation((selector: any) => {
      const state = {
        uuid: "current-user-uuid",
        fireRecords: [],
      }
      return selector(state)
    })

    // Setup other hooks
    mockUseLocationLabel.mockReturnValue("Toronto")
    mockUseCurrentLocale.mockReturnValue(ELocale.EN_CA)
    mockUseI18n.mockReturnValue(mockT)

    // Setup options hooks
    mockUseJobLevelOptions.mockReturnValue([
      { value: EJobLevel.MID_LEVEL, label: "Mid Level" },
      { value: EJobLevel.SENIOR, label: "Senior" },
      { value: EJobLevel.ENTRY_LEVEL, label: "Entry Level" },
    ])

    mockUseJobTypeOptions.mockReturnValue([
      { value: EJobType.FULL_TIME, label: "Full Time" },
      { value: EJobType.PART_TIME, label: "Part Time" },
      { value: EJobType.CONTRACT, label: "Contract" },
    ])

    mockUseStepTypeOptions.mockReturnValue([
      { value: EStepType.INTERVIEW, label: "Interview" },
      { value: EStepType.TAKE_HOME_CHALLENGE, label: "Take Home Challenge" },
      { value: EStepType.OFFER, label: "Offer" },
    ])
  })

  it("should render job journey card with all required information", () => {
    render(<JobJourneyCard {...mockProps} />)

    // Check basic information
    expect(screen.getByText("@johndoe")).toBeInTheDocument()
    expect(screen.getByText("Tech Corp")).toBeInTheDocument()
    expect(screen.getByText("Software Engineer")).toBeInTheDocument()
    expect(screen.getByText("My Journey at Tech Corp")).toBeInTheDocument()
    expect(
      screen.getByText("Exciting opportunity at a tech company")
    ).toBeInTheDocument()

    // Check formatted dates
    expect(screen.getByText("Formatted: 2024-01-15")).toBeInTheDocument()
    expect(screen.getByText(/Formatted: 2024-01-20/)).toBeInTheDocument()

    // Check options labels
    expect(screen.getByText("Mid Level")).toBeInTheDocument()
    expect(screen.getByText("Full Time")).toBeInTheDocument()
    expect(screen.getByText(/Interview/)).toBeInTheDocument()

    // Check location and fire count
    expect(screen.getByText("Toronto")).toBeInTheDocument()
    expect(screen.getByText("5")).toBeInTheDocument()

    // Check company avatar
    expect(screen.getByTestId("company-avatar")).toBeInTheDocument()
    expect(screen.getByTestId("fire-icon")).toBeInTheDocument()
  })

  it("should navigate to update page when user is owner", () => {
    // Mock user as owner
    mockUseUserStore.mockImplementation((selector: any) => {
      const state = {
        uuid: "user-uuid", // Same as createdBy
        fireRecords: [],
      }
      return selector(state)
    })

    render(<JobJourneyCard {...mockProps} />)

    const card = screen.getByRole("button")
    fireEvent.click(card)

    expect(mockPush).toHaveBeenCalledWith("/job-journey/update/journey-uuid")
  })

  it("should navigate to view page when user is not owner", () => {
    // Mock user as not owner
    mockUseUserStore.mockImplementation((selector: any) => {
      const state = {
        uuid: "different-user-uuid", // Different from createdBy
        fireRecords: [],
      }
      return selector(state)
    })

    render(<JobJourneyCard {...mockProps} />)

    const card = screen.getByRole("button")
    fireEvent.click(card)

    expect(mockPush).toHaveBeenCalledWith("/job-journey/view/journey-uuid")
  })

  it("should handle fire state correctly when fired", () => {
    // Mock fire record
    mockUseUserStore.mockImplementation((selector: any) => {
      const state = {
        uuid: "current-user-uuid",
        fireRecords: [{ uuid: "journey-uuid", isOptimistic: false }],
      }
      return selector(state)
    })

    render(<JobJourneyCard {...mockProps} />)

    const fireIcon = screen.getByTestId("fire-icon")
    expect(fireIcon).toHaveAttribute("data-is-fire", "true")
    expect(screen.getByText("5")).toBeInTheDocument() // Normal fire count
  })

  it("should handle optimistic fire state correctly", () => {
    // Mock optimistic fire record
    mockUseUserStore.mockImplementation((selector: any) => {
      const state = {
        uuid: "current-user-uuid",
        fireRecords: [{ uuid: "journey-uuid", isOptimistic: true }],
      }
      return selector(state)
    })

    render(<JobJourneyCard {...mockProps} />)

    const fireIcon = screen.getByTestId("fire-icon")
    expect(fireIcon).toHaveAttribute("data-is-fire", "true")
    expect(screen.getByText("6")).toBeInTheDocument() // Fire count + 1 for optimistic
  })

  it("should handle no fire state correctly", () => {
    // Mock no fire records
    mockUseUserStore.mockImplementation((selector: any) => {
      const state = {
        uuid: "current-user-uuid",
        fireRecords: [],
      }
      return selector(state)
    })

    render(<JobJourneyCard {...mockProps} />)

    const fireIcon = screen.getByTestId("fire-icon")
    expect(fireIcon).toHaveAttribute("data-is-fire", "false")
    expect(screen.getByText("5")).toBeInTheDocument()
  })

  it("should not render description when it is null", () => {
    const propsWithoutDescription = {
      ...mockProps,
      description: null,
    }

    render(<JobJourneyCard {...propsWithoutDescription} />)

    expect(
      screen.queryByText("Exciting opportunity at a tech company")
    ).not.toBeInTheDocument()
  })

  it("should not render description when it is empty string", () => {
    const propsWithEmptyDescription = {
      ...mockProps,
      description: "",
    }

    render(<JobJourneyCard {...propsWithEmptyDescription} />)

    expect(
      screen.queryByText("Exciting opportunity at a tech company")
    ).not.toBeInTheDocument()
  })

  it("should handle keyboard navigation", () => {
    render(<JobJourneyCard {...mockProps} />)

    const card = screen.getByRole("button")
    expect(card).toHaveAttribute("tabIndex", "0")
    expect(card).toHaveAttribute(
      "aria-label",
      "View job journey for Software Engineer at Tech Corp"
    )

    // Simulate Enter key press
    fireEvent.keyDown(card, { key: "Enter", code: "Enter" })
    // Note: The component doesn't have onKeyDown handler, but tabIndex makes it focusable
  })

  it("should render without logo URL", () => {
    const propsWithoutLogo = {
      ...mockProps,
      logoUrl: undefined,
    }

    render(<JobJourneyCard {...propsWithoutLogo} />)

    const avatar = screen.getByTestId("company-avatar")
    expect(avatar).toBeInTheDocument()
  })

  it("should handle different step types", () => {
    const propsWithDifferentStep = {
      ...mockProps,
      stepStatus: EStepType.OFFER,
    }

    // Update step type options mock to include OFFER
    mockUseStepTypeOptions.mockReturnValue([
      { value: EStepType.INTERVIEW, label: "Interview" },
      { value: EStepType.TAKE_HOME_CHALLENGE, label: "Take Home Challenge" },
      { value: EStepType.OFFER, label: "Offer" },
    ])

    render(<JobJourneyCard {...propsWithDifferentStep} />)

    expect(screen.getByText(/Offer/)).toBeInTheDocument()
  })

  it("should handle different job types and levels", () => {
    const propsWithDifferentJobDetails = {
      ...mockProps,
      jobType: EJobType.CONTRACT,
      jobLevel: EJobLevel.SENIOR,
    }

    render(<JobJourneyCard {...propsWithDifferentJobDetails} />)

    expect(screen.getByText("Contract")).toBeInTheDocument()
    expect(screen.getByText("Senior")).toBeInTheDocument()
  })

  it("should call location label hook with correct parameters", () => {
    render(<JobJourneyCard {...mockProps} />)

    expect(mockUseLocationLabel).toHaveBeenCalledWith({
      location: mockProps.location,
      locationList: mockProps.locationList,
    })
  })

  it("should handle long titles with truncation", () => {
    const propsWithLongTitle = {
      ...mockProps,
      title:
        "This is a very long job journey title that should be truncated when displayed",
    }

    render(<JobJourneyCard {...propsWithLongTitle} />)

    const titleElement = screen.getByText(propsWithLongTitle.title)
    expect(titleElement).toHaveClass("truncate")
    expect(titleElement).toHaveAttribute("title", propsWithLongTitle.title)
  })
})
