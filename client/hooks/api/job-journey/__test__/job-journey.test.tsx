import { ReactNode } from "react"
import { createJobJourney } from "@/utils/common/api"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"

import {
  TCreateJobJourneyRequest,
  TJobJourney,
  TStep,
} from "@/types/api/job-journey"
import { EJobLevel } from "@/types/common/enums/job-level"
import { EJobType } from "@/types/common/enums/job-type"
import { EStepType } from "@/types/common/enums/step-type"
import { useCreateJobJourney } from "@/hooks/api/job-journey/job-journey"

// Mock the API function
jest.mock("@/utils/common/api", () => ({
  createJobJourney: jest.fn(),
}))

const mockedCreateJobJourney = createJobJourney as jest.MockedFunction<
  typeof createJobJourney
>

/**
 * useCreateJobJourney hook test
 *
 * @group unit
 */

describe("useCreateJobJourney", () => {
  let queryClient: QueryClient

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        mutations: {
          retry: false,
        },
      },
    })
    jest.clearAllMocks()
  })

  const mockStep: TStep = {
    type: EStepType.INTERVIEW,
    date: "2024-01-15",
    remarks: "Applied online",
    position: 1,
    interviewLocation: null,
    interviewType: null,
  }

  const mockCreateRequest: TCreateJobJourneyRequest = {
    title: "Software Engineer Application",
    company: 1,
    positionTitle: "Senior Software Engineer",
    industry: "technology-uuid",
    location: "location-uuid",
    jobType: EJobType.FULL_TIME,
    jobLevel: EJobLevel.SENIOR,
    applicationDate: "2024-01-15",
    source: "Company Website",
    description: "Exciting opportunity at a tech company",
    steps: [mockStep],
    newCompany: null,
  }

  const mockJobJourneyResponse: TJobJourney = {
    id: 1,
    title: "Software Engineer Application",
    uuid: "job-journey-uuid-123",
    company_id: 1,
    company_name: "Tech Company",
    position_title: "Senior Software Engineer",
    description: "Exciting opportunity at a tech company",
    source: "Company Website",
    industry_uuid: "technology-uuid",
    location_uuid: "location-uuid",
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
      uuid: "location-uuid",
    },
    industry: {
      english_name: "Technology",
      cantonese_name: "科技",
      uuid: "technology-uuid",
    },
    fire_count: 0,
  }

  it("should be initially idle", () => {
    const { result } = renderHook(() => useCreateJobJourney(), {
      wrapper,
    })

    expect(result.current.status).toBe("idle")
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.isError).toBe(false)
    expect(result.current.data).toBeUndefined()
  })

  it("should successfully create a job journey", async () => {
    mockedCreateJobJourney.mockResolvedValue(mockJobJourneyResponse)

    const { result } = renderHook(() => useCreateJobJourney(), {
      wrapper,
    })

    result.current.mutate(mockCreateRequest)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockedCreateJobJourney).toHaveBeenCalledWith(mockCreateRequest)
    expect(result.current.data).toEqual(mockJobJourneyResponse)
    expect(result.current.isError).toBe(false)
  })

  it("should handle API errors gracefully", async () => {
    const errorMessage = "Failed to create job journey"
    mockedCreateJobJourney.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useCreateJobJourney(), {
      wrapper,
    })

    result.current.mutate(mockCreateRequest)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(new Error(errorMessage))
    expect(result.current.data).toBeUndefined()
    expect(result.current.status).toBe("error")
  })

  it("should handle network errors", async () => {
    const networkError = new Error("Network Error")
    mockedCreateJobJourney.mockRejectedValue(networkError)

    const { result } = renderHook(() => useCreateJobJourney(), {
      wrapper,
    })

    result.current.mutate(mockCreateRequest)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(networkError)
  })

  it("should reset mutation state after successful mutation", async () => {
    mockedCreateJobJourney.mockResolvedValue(mockJobJourneyResponse)

    const { result } = renderHook(() => useCreateJobJourney(), {
      wrapper,
    })

    result.current.mutate(mockCreateRequest)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockJobJourneyResponse)

    // Reset the mutation
    result.current.reset()

    await waitFor(() => {
      expect(result.current.status).toBe("idle")
      expect(result.current.isSuccess).toBe(false)
      expect(result.current.isError).toBe(false)
      expect(result.current.data).toBeUndefined()
      expect(result.current.error).toBeNull()
    })
  })

  it("should handle multiple mutations sequentially", async () => {
    const secondRequest: TCreateJobJourneyRequest = {
      ...mockCreateRequest,
      title: "Backend Developer Application",
      positionTitle: "Backend Developer",
    }

    const secondResponse: TJobJourney = {
      ...mockJobJourneyResponse,
      id: 2,
      title: "Backend Developer Application",
      position_title: "Backend Developer",
      uuid: "job-journey-uuid-456",
    }

    mockedCreateJobJourney
      .mockResolvedValueOnce(mockJobJourneyResponse)
      .mockResolvedValueOnce(secondResponse)

    const { result } = renderHook(() => useCreateJobJourney(), {
      wrapper,
    })

    // First mutation
    result.current.mutate(mockCreateRequest)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockJobJourneyResponse)

    // Reset for second mutation
    result.current.reset()

    await waitFor(() => {
      expect(result.current.data).toBeUndefined()
    })

    // Second mutation
    result.current.mutate(secondRequest)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(secondResponse)
    expect(mockedCreateJobJourney).toHaveBeenCalledTimes(2)
  })

  it("should handle mutations with async functions", async () => {
    mockedCreateJobJourney.mockResolvedValue(mockJobJourneyResponse)

    const { result } = renderHook(() => useCreateJobJourney(), {
      wrapper,
    })

    const mutateAsync = result.current.mutateAsync

    const response = await mutateAsync(mockCreateRequest)

    expect(response).toEqual(mockJobJourneyResponse)

    // Wait for the hook state to be updated after mutateAsync completes
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockJobJourneyResponse)
  })

  it("should handle request with new company creation", async () => {
    const requestWithNewCompany: TCreateJobJourneyRequest = {
      ...mockCreateRequest,
      company: null,
      newCompany: "New Tech Startup",
    }

    const responseWithNewCompany: TJobJourney = {
      ...mockJobJourneyResponse,
      company_id: 2,
      company_name: "New Tech Startup",
      company: {
        id: 2,
        name: "New Tech Startup",
        meta_data: {
          domain: null,
          logo_url: null,
        },
      },
    }

    mockedCreateJobJourney.mockResolvedValue(responseWithNewCompany)

    const { result } = renderHook(() => useCreateJobJourney(), {
      wrapper,
    })

    result.current.mutate(requestWithNewCompany)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockedCreateJobJourney).toHaveBeenCalledWith(requestWithNewCompany)
    expect(result.current.data).toEqual(responseWithNewCompany)
  })

  it("should handle request with multiple steps", async () => {
    const multipleSteps: TStep[] = [
      mockStep,
      {
        type: EStepType.TAKE_HOME_CHALLENGE,
        date: "2024-01-20",
        remarks: "Coding challenge",
        position: 2,
        interviewLocation: null,
        interviewType: null,
      },
      {
        type: EStepType.OFFER,
        date: "2024-01-25",
        remarks: "Received job offer",
        position: 3,
        interviewLocation: null,
        interviewType: null,
      },
    ]

    const requestWithMultipleSteps: TCreateJobJourneyRequest = {
      ...mockCreateRequest,
      steps: multipleSteps,
    }

    mockedCreateJobJourney.mockResolvedValue(mockJobJourneyResponse)

    const { result } = renderHook(() => useCreateJobJourney(), {
      wrapper,
    })

    result.current.mutate(requestWithMultipleSteps)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockedCreateJobJourney).toHaveBeenCalledWith(
      requestWithMultipleSteps
    )
  })
})
