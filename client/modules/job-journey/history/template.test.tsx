import React from "react"
import { useI18n } from "@/utils/services/internationalization/client"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import { TJobJourney } from "@/types/api/job-journey"
import { TLocationData } from "@/types/api/response/location"
import { EJobLevel } from "@/types/common/enums/job-level"
import { EJobType } from "@/types/common/enums/job-type"
import { EStepType } from "@/types/common/enums/step-type"
import useListJobJourneysByUserUuid from "@/hooks/api/job-journey/list-job-journeys-by-user-uuid"
import useJobJourneySortOptions from "@/hooks/common/sort/job-journey-sort-options"

import JobJourneyHistoryTemplate from "./template"

// Mock external dependencies first to prevent import issues
jest.mock("jose", () => ({}))
jest.mock("@supabase/supabase-js", () => ({}))
jest.mock("@supabase/auth-helpers-nextjs", () => ({}))
jest.mock("@supabase/auth-helpers-shared", () => ({}))

// Mock Firebase to prevent initialization issues
jest.mock("@/utils/services/firebase/config", () => ({
  __esModule: true,
  default: {},
}))

// Mock Supabase config
jest.mock("@/utils/services/supabase/config", () => ({
  __esModule: true,
  default: {},
}))

// Mock common API utilities
jest.mock("@/utils/common/api", () => ({
  getJobJourneysByUserUuid: jest.fn(),
}))

// Mock all dependencies
jest.mock("@/hooks/api/job-journey/list-job-journeys-by-user-uuid")
jest.mock("@/hooks/common/sort/job-journey-sort-options")
jest.mock("@/utils/services/internationalization/client")
jest.mock(
  "@/modules/job-journey/component/job-journey-card/job-journey-card",
  () => {
    return function MockJobJourneyCard(props: any) {
      return (
        <div data-testid="job-journey-card" data-uuid={props.uuid}>
          <span>{props.title}</span>
          <span>{props.companyName}</span>
          <span>{props.username}</span>
        </div>
      )
    }
  }
)
jest.mock("@/components/customized-ui/selects/base", () => {
  return function MockBaseSelect({ onChange, options, value }: any) {
    return (
      <select
        data-testid="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }
})
jest.mock("@/components/customized-ui/skeletons/card-list", () => {
  return function MockCardSkeletonList() {
    return <div data-testid="skeleton-list">Loading...</div>
  }
})

// Mock hooks
const mockUseListJobJourneysByUserUuid =
  useListJobJourneysByUserUuid as jest.MockedFunction<
    typeof useListJobJourneysByUserUuid
  >
const mockUseJobJourneySortOptions =
  useJobJourneySortOptions as jest.MockedFunction<
    typeof useJobJourneySortOptions
  >
const mockUseI18n = useI18n as jest.MockedFunction<typeof useI18n>

/**
 * JobJourneyHistoryTemplate component tests
 * @group unit
 */
describe("JobJourneyHistoryTemplate", () => {
  const mockLocationList: TLocationData[] = [
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
    {
      id: 2,
      uuid: "vancouver-uuid",
      value: "vancouver",
      english_name: "Vancouver",
      cantonese_name: "溫哥華",
      level: 1,
      parent_uuid: null,
      country_uuid: "canada-uuid",
      meta_data: {
        emoji: "🇨🇦",
      },
    },
  ]

  const mockJobJourneyList: TJobJourney[] = [
    {
      id: 1,
      uuid: "journey-1-uuid",
      company_id: 1,
      company: {
        id: 1,
        name: "Tech Corp",
        meta_data: {
          domain: "techcorp.com",
          logo_url: "https://example.com/logo.png",
        },
      },
      company_name: "Tech Corp",
      position_title: "Software Engineer",
      title: "My Journey at Tech Corp",
      content: "Detailed journey content here",
      source: "linkedin",
      industry_uuid: "tech-uuid",
      location_uuid: "toronto-uuid",
      location: {
        uuid: "toronto-uuid",
        english_name: "Toronto",
        cantonese_name: "多倫多",
      },
      industry: {
        uuid: "tech-uuid",
        english_name: "Technology",
        cantonese_name: "科技",
      },
      job_type: EJobType.FULL_TIME,
      job_level: EJobLevel.MID_LEVEL,
      application_submitted_date: "2024-01-15",
      visibility: "public",
      status: "active",
      created_by: "user-uuid",
      user: {
        uuid: "user-uuid",
        username: "johndoe",
      },
      created_at: "2024-01-10T10:00:00Z",
      updated_at: "2024-01-20T10:00:00Z",
      last_step_status: EStepType.INTERVIEW,
      last_step_status_updated_at: "2024-01-15T10:00:00Z",
      description: "Exciting opportunity at a tech company",
      fire_count: 5,
    },
    {
      id: 2,
      uuid: "journey-2-uuid",
      company_id: 2,
      company: {
        id: 2,
        name: "Startup Inc",
        meta_data: {
          domain: "startup.com",
          logo_url: "https://example.com/startup-logo.png",
        },
      },
      company_name: "Startup Inc",
      position_title: "Frontend Developer",
      title: "Frontend Role at Startup",
      content: "Frontend development journey",
      source: "company_website",
      industry_uuid: "tech-uuid",
      location_uuid: "vancouver-uuid",
      location: {
        uuid: "vancouver-uuid",
        english_name: "Vancouver",
        cantonese_name: "溫哥華",
      },
      industry: {
        uuid: "tech-uuid",
        english_name: "Technology",
        cantonese_name: "科技",
      },
      job_type: EJobType.CONTRACT,
      job_level: EJobLevel.SENIOR,
      application_submitted_date: "2024-02-01",
      visibility: "public",
      status: "active",
      created_by: "user-uuid",
      user: {
        uuid: "user-uuid",
        username: "johndoe",
      },
      created_at: "2024-01-25T10:00:00Z",
      updated_at: "2024-02-05T10:00:00Z",
      last_step_status: EStepType.OFFER,
      last_step_status_updated_at: "2024-02-01T10:00:00Z",
      description: "Innovative startup environment",
      fire_count: 3,
    },
  ]

  const mockSortOptions = [
    { value: "createdAt,desc", label: "Newest First" },
    { value: "createdAt,asc", label: "Oldest First" },
    { value: "applicationDate,desc", label: "Application Date (Newest)" },
    { value: "applicationDate,asc", label: "Application Date (Oldest)" },
  ]

  const mockT = jest.fn((key: string) => {
    const translations: Record<string, string> = {
      "general.sorting": "Sorting",
      "history.no_data": "No job journeys found",
    }
    return translations[key] || key
  })

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()

    // Setup mocks
    mockUseI18n.mockReturnValue(mockT)
    mockUseJobJourneySortOptions.mockReturnValue(mockSortOptions)

    // Default mock for the API hook
    mockUseListJobJourneysByUserUuid.mockReturnValue({
      data: mockJobJourneyList,
      isLoading: false,
      isError: false,
      error: null,
    } as any)
  })

  const defaultProps = {
    slug: "user-uuid",
    locationList: mockLocationList,
  }

  it("should render sorting controls", () => {
    render(<JobJourneyHistoryTemplate {...defaultProps} />)

    expect(screen.getByText("Sorting")).toBeInTheDocument()
    expect(screen.getByTestId("sort-select")).toBeInTheDocument()
  })

  it("should render job journey cards when data is available", () => {
    render(<JobJourneyHistoryTemplate {...defaultProps} />)

    const cards = screen.getAllByTestId("job-journey-card")
    expect(cards.length).toBeGreaterThan(0)
    expect(screen.getByText("My Journey at Tech Corp")).toBeInTheDocument()
    expect(screen.getByText("Tech Corp")).toBeInTheDocument()
    expect(screen.getAllByText("johndoe")).toHaveLength(2) // Both cards have same username
  })

  it("should render multiple job journey cards", () => {
    render(<JobJourneyHistoryTemplate {...defaultProps} />)

    const cards = screen.getAllByTestId("job-journey-card")
    expect(cards).toHaveLength(2)

    expect(screen.getByText("My Journey at Tech Corp")).toBeInTheDocument()
    expect(screen.getByText("Frontend Role at Startup")).toBeInTheDocument()
  })

  it("should show loading skeleton when data is loading", () => {
    mockUseListJobJourneysByUserUuid.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as any)

    render(<JobJourneyHistoryTemplate {...defaultProps} />)

    expect(screen.getByTestId("skeleton-list")).toBeInTheDocument()
    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("should show no data message when there are no job journeys", () => {
    mockUseListJobJourneysByUserUuid.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    } as any)

    render(<JobJourneyHistoryTemplate {...defaultProps} />)

    expect(screen.getByText("No job journeys found")).toBeInTheDocument()
    expect(screen.queryByTestId("job-journey-card")).not.toBeInTheDocument()
  })

  it("should handle sort option changes", async () => {
    render(<JobJourneyHistoryTemplate {...defaultProps} />)

    const sortSelect = screen.getByTestId("sort-select")

    // Change sort option
    fireEvent.change(sortSelect, { target: { value: "applicationDate,asc" } })

    await waitFor(() => {
      expect(mockUseListJobJourneysByUserUuid).toHaveBeenCalledWith(
        "user-uuid",
        "applicationDate,asc"
      )
    })
  })

  it("should use default sort option on initial render", () => {
    render(<JobJourneyHistoryTemplate {...defaultProps} />)

    expect(mockUseListJobJourneysByUserUuid).toHaveBeenCalledWith(
      "user-uuid",
      "createdAt,desc"
    )
  })

  it("should pass correct props to JobJourneyCard components", () => {
    render(<JobJourneyHistoryTemplate {...defaultProps} />)

    const firstCard = screen.getAllByTestId("job-journey-card")[0]
    expect(firstCard).toHaveAttribute("data-uuid", "journey-1-uuid")
  })

  it("should handle job journeys with null location_uuid", () => {
    const jobJourneysWithNullLocation = [
      {
        ...mockJobJourneyList[0],
        location_uuid: null,
      },
    ]

    mockUseListJobJourneysByUserUuid.mockReturnValue({
      data: jobJourneysWithNullLocation,
      isLoading: false,
      isError: false,
      error: null,
    } as any)

    render(<JobJourneyHistoryTemplate {...defaultProps} />)

    expect(screen.getByTestId("job-journey-card")).toBeInTheDocument()
  })

  it("should handle job journeys with null company_name", () => {
    const jobJourneysWithNullCompany = [
      {
        ...mockJobJourneyList[0],
        company_name: null,
      },
    ]

    mockUseListJobJourneysByUserUuid.mockReturnValue({
      data: jobJourneysWithNullCompany,
      isLoading: false,
      isError: false,
      error: null,
    } as any)

    render(<JobJourneyHistoryTemplate {...defaultProps} />)

    expect(screen.getByTestId("job-journey-card")).toBeInTheDocument()
  })

  it("should handle job journeys without user information", () => {
    const jobJourneysWithoutUser = [
      {
        ...mockJobJourneyList[0],
        user: null,
      },
    ]

    mockUseListJobJourneysByUserUuid.mockReturnValue({
      data: jobJourneysWithoutUser,
      isLoading: false,
      isError: false,
      error: null,
    } as any)

    render(<JobJourneyHistoryTemplate {...defaultProps} />)

    expect(screen.getByTestId("job-journey-card")).toBeInTheDocument()
  })

  it("should handle job journeys without company logo", () => {
    const jobJourneysWithoutLogo = [
      {
        ...mockJobJourneyList[0],
        company: {
          ...mockJobJourneyList[0].company!,
          meta_data: {
            domain: "techcorp.com",
            logo_url: null,
          },
        },
      },
    ]

    mockUseListJobJourneysByUserUuid.mockReturnValue({
      data: jobJourneysWithoutLogo,
      isLoading: false,
      isError: false,
      error: null,
    } as any)

    render(<JobJourneyHistoryTemplate {...defaultProps} />)

    expect(screen.getByTestId("job-journey-card")).toBeInTheDocument()
  })

  it("should handle job journeys without company information", () => {
    const jobJourneysWithoutCompany = [
      {
        ...mockJobJourneyList[0],
        company: null,
      },
    ]

    mockUseListJobJourneysByUserUuid.mockReturnValue({
      data: jobJourneysWithoutCompany,
      isLoading: false,
      isError: false,
      error: null,
    } as any)

    render(<JobJourneyHistoryTemplate {...defaultProps} />)

    expect(screen.getByTestId("job-journey-card")).toBeInTheDocument()
  })

  it("should map location information correctly", () => {
    render(<JobJourneyHistoryTemplate {...defaultProps} />)

    // The component should find Toronto location from the locationList
    const cards = screen.getAllByTestId("job-journey-card")
    expect(cards.length).toBeGreaterThan(0)

    // Verify the hook is called with the correct parameters
    expect(mockUseListJobJourneysByUserUuid).toHaveBeenCalledWith(
      "user-uuid",
      "createdAt,desc"
    )
  })

  it("should handle empty location list", () => {
    const propsWithEmptyLocationList = {
      slug: "user-uuid",
      locationList: [],
    }

    render(<JobJourneyHistoryTemplate {...propsWithEmptyLocationList} />)

    const cards = screen.getAllByTestId("job-journey-card")
    expect(cards.length).toBeGreaterThan(0)
  })

  it("should render grid layout for job journey cards", () => {
    render(<JobJourneyHistoryTemplate {...defaultProps} />)

    // Find the grid container directly by class selector
    const gridContainer = document.querySelector(".grid")
    expect(gridContainer).not.toBeNull()
    expect(gridContainer).toHaveClass("grid")
  })

  it("should call useListJobJourneysByUserUuid with correct parameters when sort changes", async () => {
    render(<JobJourneyHistoryTemplate {...defaultProps} />)

    const sortSelect = screen.getByTestId("sort-select")

    // Initial call
    expect(mockUseListJobJourneysByUserUuid).toHaveBeenCalledWith(
      "user-uuid",
      "createdAt,desc"
    )

    // Change sort option
    fireEvent.change(sortSelect, { target: { value: "applicationDate,desc" } })

    await waitFor(() => {
      expect(mockUseListJobJourneysByUserUuid).toHaveBeenCalledWith(
        "user-uuid",
        "applicationDate,desc"
      )
    })
  })

  it("should handle fire_count being null or undefined", () => {
    const jobJourneysWithNullFireCount = [
      {
        ...mockJobJourneyList[0],
        fire_count: null,
      },
    ]

    mockUseListJobJourneysByUserUuid.mockReturnValue({
      data: jobJourneysWithNullFireCount,
      isLoading: false,
      isError: false,
      error: null,
    } as any)

    render(<JobJourneyHistoryTemplate {...defaultProps} />)

    expect(screen.getByTestId("job-journey-card")).toBeInTheDocument()
  })
})
