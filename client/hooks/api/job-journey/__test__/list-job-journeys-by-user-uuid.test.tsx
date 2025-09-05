import { ReactNode } from "react"
import { getJobJourneysByUserUuid } from "@/utils/common/api"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"

import { TJobJourney } from "@/types/api/job-journey"
import { EJobLevel } from "@/types/common/enums/job-level"
import { EJobType } from "@/types/common/enums/job-type"
import { EStepType } from "@/types/common/enums/step-type"
import { EQueryKeyString } from "@/types/common/query-key-string"
import useListJobJourneysByUserUuid from "@/hooks/api/job-journey/list-job-journeys-by-user-uuid"

// Mock the API function
jest.mock("@/utils/common/api", () => ({
  getJobJourneysByUserUuid: jest.fn(),
}))

const mockedGetJobJourneysByUserUuid =
  getJobJourneysByUserUuid as jest.MockedFunction<
    typeof getJobJourneysByUserUuid
  >

/**
 * useListJobJourneysByUserUuid
 * @group unit
 */
describe("useListJobJourneysByUserUuid", () => {
  let queryClient: QueryClient

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
    jest.clearAllMocks()
  })

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
      last_step_status: EStepType.INTERVIEW,
      last_step_status_updated_at: "2024-02-01T10:00:00Z",
      description: "Innovative startup environment",
      fire_count: 3,
    },
  ]

  it("should call API and return job journey list data", async () => {
    mockedGetJobJourneysByUserUuid.mockResolvedValue(mockJobJourneyList)

    const { result } = renderHook(
      () => useListJobJourneysByUserUuid("user-uuid"),
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockedGetJobJourneysByUserUuid).toHaveBeenCalledTimes(1)
    expect(mockedGetJobJourneysByUserUuid).toHaveBeenCalledWith(
      "user-uuid",
      "createdAt,desc"
    )
    expect(result.current.data).toEqual(mockJobJourneyList)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe(false)
  })

  it("should call API with custom sort option", async () => {
    mockedGetJobJourneysByUserUuid.mockResolvedValue(mockJobJourneyList)

    const { result } = renderHook(
      () => useListJobJourneysByUserUuid("user-uuid", "applicationDate,asc"),
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockedGetJobJourneysByUserUuid).toHaveBeenCalledWith(
      "user-uuid",
      "applicationDate,asc"
    )
  })

  it("should handle empty job journey list", async () => {
    mockedGetJobJourneysByUserUuid.mockResolvedValue([])

    const { result } = renderHook(
      () => useListJobJourneysByUserUuid("user-uuid"),
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual([])
    expect(result.current.isLoading).toBe(false)
  })

  it("should handle API error", async () => {
    const errorMessage = "Failed to fetch user job journeys"
    mockedGetJobJourneysByUserUuid.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(
      () => useListJobJourneysByUserUuid("user-uuid"),
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(new Error(errorMessage))
    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBe(false)
  })

  it("should not call API when userUuid is empty", () => {
    renderHook(() => useListJobJourneysByUserUuid(""), { wrapper })

    expect(mockedGetJobJourneysByUserUuid).not.toHaveBeenCalled()
  })

  it("should use correct query key", () => {
    const { result } = renderHook(
      () => useListJobJourneysByUserUuid("user-uuid", "createdAt,desc"),
      { wrapper }
    )

    expect(result.current).toBeDefined()

    // Check that the query was registered with the correct key
    const queries = queryClient.getQueryCache().getAll()
    const query = queries.find(
      (q) =>
        JSON.stringify(q.queryKey) ===
        JSON.stringify([
          EQueryKeyString.JOB_JOURNEY_BY_USER_UUID,
          "user-uuid",
          "createdAt,desc",
        ])
    )
    expect(query).toBeDefined()
  })

  it("should handle network timeout", async () => {
    const timeoutError = new Error("Network timeout")
    timeoutError.name = "TimeoutError"
    mockedGetJobJourneysByUserUuid.mockRejectedValue(timeoutError)

    const { result } = renderHook(
      () => useListJobJourneysByUserUuid("user-uuid"),
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(timeoutError)
    expect(result.current.data).toBeUndefined()
  })

  it("should handle job journeys with null values", async () => {
    const jobJourneysWithNulls: TJobJourney[] = [
      {
        ...mockJobJourneyList[0],
        company_name: null,
        description: "",
        fire_count: 0,
        location_uuid: null,
      },
    ]

    mockedGetJobJourneysByUserUuid.mockResolvedValue(jobJourneysWithNulls)

    const { result } = renderHook(
      () => useListJobJourneysByUserUuid("user-uuid"),
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(jobJourneysWithNulls)
    expect(result.current.data?.[0]?.company_name).toBeNull()
    expect(result.current.data?.[0]?.description).toBe("")
  })

  it("should handle different job levels and types", async () => {
    const diverseJobJourneys: TJobJourney[] = [
      {
        ...mockJobJourneyList[0],
        job_level: EJobLevel.ENTRY_LEVEL,
        job_type: EJobType.PART_TIME,
      },
      {
        ...mockJobJourneyList[1],
        job_level: EJobLevel.SENIOR,
        job_type: EJobType.CONTRACT,
      },
    ]

    mockedGetJobJourneysByUserUuid.mockResolvedValue(diverseJobJourneys)

    const { result } = renderHook(
      () => useListJobJourneysByUserUuid("user-uuid"),
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(diverseJobJourneys)
    expect(result.current.data?.[0]?.job_level).toBe(EJobLevel.ENTRY_LEVEL)
    expect(result.current.data?.[0]?.job_type).toBe(EJobType.PART_TIME)
  })
})
