import { ReactNode } from "react"
import { createFire } from "@/utils/common/api"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react"

import { TCreateFireRequest, TFireData } from "@/types/api/fire"
import { EFireType } from "@/types/common/enums/fire-type"
import { useCreateFire } from "@/hooks/api/fire/create-fire"

// Mock the API function
jest.mock("@/utils/common/api", () => ({
  createFire: jest.fn(),
}))

const mockedCreateFire = createFire as jest.MockedFunction<typeof createFire>

/**
 * useCreateFire hook test
 *
 * @group unit
 */

describe("useCreateFire", () => {
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

  const mockFireRequest: TCreateFireRequest = {
    type: EFireType.JOB_JOURNEY,
    refUuid: "test-ref-uuid-123",
  }

  const mockFireData: TFireData = {
    id: 1,
    type: EFireType.JOB_JOURNEY,
    ref_uuid: "test-ref-uuid-123",
    created_by: "user-uuid-456",
  }

  it("should initialize with idle state", () => {
    const { result } = renderHook(() => useCreateFire(), { wrapper })

    expect(result.current.isIdle).toBe(true)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe(false)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBeNull()
  })

  it("should successfully create a fire", async () => {
    mockedCreateFire.mockResolvedValue(mockFireData)

    const { result } = renderHook(() => useCreateFire(), { wrapper })

    act(() => {
      result.current.mutate(mockFireRequest)
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockedCreateFire).toHaveBeenCalledWith(mockFireRequest)
    expect(result.current.data).toEqual(mockFireData)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe(false)
  })

  it("should handle API errors", async () => {
    const errorMessage = "Failed to create fire"
    mockedCreateFire.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useCreateFire(), { wrapper })

    act(() => {
      result.current.mutate(mockFireRequest)
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(mockedCreateFire).toHaveBeenCalledWith(mockFireRequest)
    expect(result.current.error).toEqual(new Error(errorMessage))
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.data).toBeUndefined()
  })

  it("should handle different fire types", async () => {
    const jobJourneyFireRequest: TCreateFireRequest = {
      type: EFireType.JOB_JOURNEY,
      refUuid: "job-journey-uuid-123",
    }

    const jobJourneyFireData: TFireData = {
      id: 2,
      type: EFireType.JOB_JOURNEY,
      ref_uuid: "job-journey-uuid-123",
      created_by: "user-uuid-789",
    }

    mockedCreateFire.mockResolvedValue(jobJourneyFireData)

    const { result } = renderHook(() => useCreateFire(), { wrapper })

    act(() => {
      result.current.mutate(jobJourneyFireRequest)
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockedCreateFire).toHaveBeenCalledWith(jobJourneyFireRequest)
    expect(result.current.data).toEqual(jobJourneyFireData)
  })

  it("should reset state between mutations", async () => {
    mockedCreateFire.mockResolvedValueOnce(mockFireData)

    const { result } = renderHook(() => useCreateFire(), { wrapper })

    // First mutation
    act(() => {
      result.current.mutate(mockFireRequest)
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockFireData)

    // Reset
    act(() => {
      result.current.reset()
    })

    await waitFor(() => {
      expect(result.current.isIdle).toBe(true)
    })

    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBeNull()
  })

  it("should call onSuccess callback when provided", async () => {
    mockedCreateFire.mockResolvedValue(mockFireData)
    const onSuccessMock = jest.fn()

    const { result } = renderHook(() => useCreateFire(), { wrapper })

    act(() => {
      result.current.mutate(mockFireRequest, {
        onSuccess: onSuccessMock,
      })
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(onSuccessMock).toHaveBeenCalledWith(
      mockFireData,
      mockFireRequest,
      undefined
    )
  })

  it("should call onError callback when provided", async () => {
    const error = new Error("API Error")
    mockedCreateFire.mockRejectedValue(error)
    const onErrorMock = jest.fn()

    const { result } = renderHook(() => useCreateFire(), { wrapper })

    act(() => {
      result.current.mutate(mockFireRequest, {
        onError: onErrorMock,
      })
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(onErrorMock).toHaveBeenCalledWith(error, mockFireRequest, undefined)
  })
})
