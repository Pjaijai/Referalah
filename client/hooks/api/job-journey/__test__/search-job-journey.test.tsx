import { ReactNode } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { searchJobJourney } from "@/utils/common/api"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react"

import { TJobJourney } from "@/types/api/job-journey"
import { IIndustryResponse } from "@/types/api/response/industry"
import { TLocationData } from "@/types/api/response/location"
import { EJobLevel } from "@/types/common/enums/job-level"
import { EJobType } from "@/types/common/enums/job-type"
import { EStepType } from "@/types/common/enums/step-type"
import { EQueryKeyString } from "@/types/common/query-key-string"
import useSearchJourney from "@/hooks/api/job-journey/search-job-journey"

// Mock Next.js navigation hooks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}))

// Mock the API function
jest.mock("@/utils/common/api", () => ({
  searchJobJourney: jest.fn(),
}))

// Mock the helper function
jest.mock("@/modules/job-journey/helpers/find-related-location", () => {
  return jest.fn((locationList: TLocationData[], value?: string) => {
    if (!value || value === "all") return []
    const location = locationList.find((loc) => loc.value === value)
    return location ? [location.uuid] : []
  })
})

// Mock the debounce hook
jest.mock("@/hooks/common/debounce", () => {
  return jest.fn((value: string) => value)
})

// Mock the sort options hook
jest.mock("@/hooks/common/sort/job-journey-sort-options", () => {
  return jest.fn(() => [
    { value: "created_at_desc", label: "Newest" },
    { value: "created_at_asc", label: "Oldest" },
  ])
})

const mockedSearchJobJourney = searchJobJourney as jest.MockedFunction<
  typeof searchJobJourney
>
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockedUsePathname = usePathname as jest.MockedFunction<typeof usePathname>
const mockedUseSearchParams = useSearchParams as jest.MockedFunction<
  typeof useSearchParams
>

/**
 * useSearchJourney hook test
 *
 * @group unit
 */

describe("useSearchJourney", () => {
  let queryClient: QueryClient
  const mockPush = jest.fn()
  const mockPathname = "/job-journeys"

  const wrapper = ({ children }: { children: ReactNode }) => (
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

    // Mock Next.js hooks
    mockedUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    } as any)

    mockedUsePathname.mockReturnValue(mockPathname)

    // Mock empty search params by default
    const mockSearchParams = new URLSearchParams()
    mockedUseSearchParams.mockReturnValue(mockSearchParams as any)

    jest.clearAllMocks()
  })

  const mockLocationList: TLocationData[] = [
    {
      id: 1,
      uuid: "hk-uuid",
      value: "hong-kong",
      english_name: "Hong Kong",
      cantonese_name: "香港",
      level: 1,
      parent_uuid: null,
      country_uuid: "china-uuid",
      meta_data: {
        emoji: "🇭🇰",
      },
    },
    {
      id: 2,
      uuid: "ny-uuid",
      value: "new-york",
      english_name: "New York",
      cantonese_name: "紐約",
      level: 1,
      parent_uuid: null,
      country_uuid: "usa-uuid",
      meta_data: {
        emoji: "🇺🇸",
      },
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

  const mockJobJourneyData: TJobJourney[] = [
    {
      id: 1,
      title: "Software Engineer Application",
      uuid: "job-journey-uuid-1",
      company_id: 1,
      company_name: "Tech Company",
      position_title: "Software Engineer",
      description: "Great opportunity",
      source: "Company Website",
      industry_uuid: "tech-uuid",
      location_uuid: "hk-uuid",
      job_type: EJobType.FULL_TIME,
      job_level: EJobLevel.SENIOR,
      application_submitted_date: "2024-01-15",
      visibility: "public",
      content: null,
      status: "active",
      created_by: "user-uuid-123",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: null,
      last_step_status: EStepType.INTERVIEW,
      last_step_status_updated_at: "2024-01-15T10:00:00Z",
      company: {
        id: 1,
        name: "Tech Company",
        meta_data: {
          domain: "techcompany.com",
          logo_url: null,
        },
      },
      user: {
        username: "testuser",
        uuid: "user-uuid-123",
      },
      location: {
        english_name: "Hong Kong",
        cantonese_name: "香港",
        uuid: "hk-uuid",
      },
      industry: {
        english_name: "Technology",
        cantonese_name: "科技",
        uuid: "tech-uuid",
      },
      fire_count: 5,
    },
  ]

  const defaultProps = {
    locationList: mockLocationList,
    industryList: mockIndustryList,
  }

  it("should initialize with default values", () => {
    mockedSearchJobJourney.mockResolvedValue(mockJobJourneyData)

    const { result } = renderHook(() => useSearchJourney(defaultProps), {
      wrapper,
    })

    expect(result.current.keywords).toBe("")
    expect(result.current.jobLevel).toBe("all")
    expect(result.current.company).toBeNull()
    expect(result.current.location).toBe("all")
    expect(result.current.industry).toBe("all")
    expect(result.current.sorting).toBe("created_at_desc")
  })

  it("should initialize with URL search params", () => {
    const searchParams = new URLSearchParams({
      keywords: "software engineer",
      jobLevel: EJobLevel.SENIOR,
      location: "hong-kong",
      industry: "technology",
      sorting: "created_at_asc",
      companyName: "Tech Corp",
      companyId: "123",
    })
    mockedUseSearchParams.mockReturnValue(searchParams as any)
    mockedSearchJobJourney.mockResolvedValue(mockJobJourneyData)

    const { result } = renderHook(() => useSearchJourney(defaultProps), {
      wrapper,
    })

    expect(result.current.keywords).toBe("software engineer")
    expect(result.current.jobLevel).toBe(EJobLevel.SENIOR)
    expect(result.current.location).toBe("hong-kong")
    expect(result.current.sorting).toBe("created_at_asc")
    expect(result.current.company).toEqual({
      name: "Tech Corp",
      id: 123,
    })
  })

  it("should handle keywords change", async () => {
    mockedSearchJobJourney.mockResolvedValue(mockJobJourneyData)

    const { result } = renderHook(() => useSearchJourney(defaultProps), {
      wrapper,
    })

    act(() => {
      result.current.handleKeywordsChange({
        target: { value: "react developer" },
      } as any)
    })

    expect(result.current.keywords).toBe("react developer")
  })

  it("should handle job level change", async () => {
    mockedSearchJobJourney.mockResolvedValue(mockJobJourneyData)

    const { result } = renderHook(() => useSearchJourney(defaultProps), {
      wrapper,
    })

    act(() => {
      result.current.handleJobLevelChange(EJobLevel.MID_LEVEL)
    })

    expect(result.current.jobLevel).toBe(EJobLevel.MID_LEVEL)
  })

  it("should handle company change", async () => {
    mockedSearchJobJourney.mockResolvedValue(mockJobJourneyData)

    const { result } = renderHook(() => useSearchJourney(defaultProps), {
      wrapper,
    })

    act(() => {
      result.current.handleCompanyChange("Google", 1, false)
    })

    expect(result.current.company).toEqual({
      name: "Google",
      id: 1,
    })
  })

  it("should handle company reset", async () => {
    const searchParams = new URLSearchParams({
      companyName: "Tech Corp",
      companyId: "123",
    })
    mockedUseSearchParams.mockReturnValue(searchParams as any)
    mockedSearchJobJourney.mockResolvedValue(mockJobJourneyData)

    const { result } = renderHook(() => useSearchJourney(defaultProps), {
      wrapper,
    })

    act(() => {
      result.current.handleCompanyChange(null, null, true)
    })

    expect(result.current.company).toBeNull()
  })

  it("should handle location change", async () => {
    mockedSearchJobJourney.mockResolvedValue(mockJobJourneyData)

    const { result } = renderHook(() => useSearchJourney(defaultProps), {
      wrapper,
    })

    act(() => {
      result.current.handleLocationChange("hk-uuid")
    })

    expect(result.current.location).toBe("hong-kong")
  })

  it("should handle industry change", async () => {
    mockedSearchJobJourney.mockResolvedValue(mockJobJourneyData)

    const { result } = renderHook(() => useSearchJourney(defaultProps), {
      wrapper,
    })

    act(() => {
      result.current.handleIndustryChange("tech-uuid")
    })

    expect(result.current.industry).toBe("tech-uuid")
  })

  it("should handle sorting change", async () => {
    mockedSearchJobJourney.mockResolvedValue(mockJobJourneyData)

    const { result } = renderHook(() => useSearchJourney(defaultProps), {
      wrapper,
    })

    act(() => {
      result.current.handleSortingChange("created_at_asc")
    })

    expect(result.current.sorting).toBe("created_at_asc")
  })

  it("should handle reset", async () => {
    const searchParams = new URLSearchParams({
      keywords: "software engineer",
      jobLevel: EJobLevel.SENIOR,
      location: "hong-kong",
    })
    mockedUseSearchParams.mockReturnValue(searchParams as any)
    mockedSearchJobJourney.mockResolvedValue(mockJobJourneyData)

    const { result } = renderHook(() => useSearchJourney(defaultProps), {
      wrapper,
    })

    act(() => {
      result.current.handleReset()
    })

    expect(result.current.keywords).toBe("")
    expect(result.current.jobLevel).toBe("all")
    expect(result.current.location).toBe("all")
    expect(result.current.company).toBeNull()
    expect(mockPush).toHaveBeenCalledWith(mockPathname)
  })

  it("should call search API with correct parameters", async () => {
    mockedSearchJobJourney.mockResolvedValue(mockJobJourneyData)

    renderHook(() => useSearchJourney(defaultProps), {
      wrapper,
    })

    await waitFor(() => {
      expect(mockedSearchJobJourney).toHaveBeenCalledWith({
        keywords: "",
        numberOfItemsPerPage: 5,
        locations: [],
        jobLevel: "all",
        companyId: undefined,
        industry: "all",
        page: 0,
        sortingType: "created_at_desc",
      })
    })
  })

  it("should handle API errors gracefully", async () => {
    const errorMessage = "Failed to search job journeys"
    mockedSearchJobJourney.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useSearchJourney(defaultProps), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.result.isError).toBe(true)
    })

    expect(result.current.result.error).toEqual(new Error(errorMessage))
  })

  it("should handle infinite loading with pagination", async () => {
    const firstPage = mockJobJourneyData
    const secondPage = [
      {
        ...mockJobJourneyData[0],
        id: 2,
        uuid: "job-journey-uuid-2",
        title: "Backend Developer Application",
      },
    ]

    mockedSearchJobJourney
      .mockResolvedValueOnce(firstPage)
      .mockResolvedValueOnce(secondPage)

    const { result } = renderHook(() => useSearchJourney(defaultProps), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.result.isSuccess).toBe(true)
    })

    expect(result.current.result.data?.pages).toHaveLength(1)
    expect(result.current.result.data?.pages[0]).toEqual(firstPage)

    // Test loading next page
    act(() => {
      result.current.result.fetchNextPage()
    })

    await waitFor(() => {
      expect(result.current.result.data?.pages).toHaveLength(2)
    })

    expect(result.current.result.data?.pages[1]).toEqual(secondPage)
  })

  it("should update URL when filters change", async () => {
    mockedSearchJobJourney.mockResolvedValue(mockJobJourneyData)

    const { result } = renderHook(() => useSearchJourney(defaultProps), {
      wrapper,
    })

    act(() => {
      result.current.handleJobLevelChange(EJobLevel.SENIOR)
    })

    // URL should be updated with new query parameters
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled()
    })
  })

  it("should handle empty search results", async () => {
    mockedSearchJobJourney.mockResolvedValue([])

    const { result } = renderHook(() => useSearchJourney(defaultProps), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.result.isSuccess).toBe(true)
    })

    expect(result.current.result.data?.pages[0]).toEqual([])
  })
})
