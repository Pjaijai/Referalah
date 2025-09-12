import { ReactNode } from "react"
import { getFiresByUserUuid } from "@/utils/common/api"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"

import { TFireData } from "@/types/api/fire"
import { EFireType } from "@/types/common/enums/fire-type"
import { EQueryKeyString } from "@/types/common/query-key-string"
import useGetFiresByUserUuid from "@/hooks/api/fire/get-fires-by-user-uuid"

// Mock the API function
jest.mock("@/utils/common/api", () => ({
  getFiresByUserUuid: jest.fn(),
}))

const mockedGetFiresByUserUuid = getFiresByUserUuid as jest.MockedFunction<
  typeof getFiresByUserUuid
>

/**
 * useGetFiresByUserUuid hook test
 *
 * @group unit
 */

describe("useGetFiresByUserUuid", () => {
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

  const mockUserUuid = "test-user-uuid-123"
  const mockFiresData: TFireData[] = [
    {
      id: 1,
      type: EFireType.JOB_JOURNEY,
      ref_uuid: "job-journey-uuid-1",
      created_by: mockUserUuid,
    },
    {
      id: 2,
      type: EFireType.JOB_JOURNEY,
      ref_uuid: "job-journey-uuid-2",
      created_by: mockUserUuid,
    },
  ]

  it("should not call API when userUuid is null", () => {
    const { result } = renderHook(() => useGetFiresByUserUuid(null), {
      wrapper,
    })

    expect(mockedGetFiresByUserUuid).not.toHaveBeenCalled()
    expect(result.current.data).toBeUndefined()
    // Disabled queries can still show isLoading as true initially
    expect(result.current.isError).toBe(false)
    expect(result.current.isSuccess).toBe(false)
  })

  it("should not call API when userUuid is empty string", () => {
    const { result } = renderHook(() => useGetFiresByUserUuid(""), {
      wrapper,
    })

    expect(mockedGetFiresByUserUuid).not.toHaveBeenCalled()
    expect(result.current.data).toBeUndefined()
    // Disabled queries can still show isLoading as true initially
    expect(result.current.isError).toBe(false)
    expect(result.current.isSuccess).toBe(false)
  })

  it("should call API with correct userUuid when provided", async () => {
    mockedGetFiresByUserUuid.mockResolvedValue(mockFiresData)

    const { result } = renderHook(() => useGetFiresByUserUuid(mockUserUuid), {
      wrapper,
    })

    expect(mockedGetFiresByUserUuid).toHaveBeenCalledWith({
      uuid: mockUserUuid,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockFiresData)
  })

  it("should handle API errors gracefully", async () => {
    const errorMessage = "Failed to fetch fires"
    mockedGetFiresByUserUuid.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useGetFiresByUserUuid(mockUserUuid), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(new Error(errorMessage))
    expect(result.current.data).toBeUndefined()
  })

  it("should be initially loading when userUuid is provided", () => {
    mockedGetFiresByUserUuid.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )

    const { result } = renderHook(() => useGetFiresByUserUuid(mockUserUuid), {
      wrapper,
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()
  })

  it("should use correct query key", async () => {
    mockedGetFiresByUserUuid.mockResolvedValue(mockFiresData)

    renderHook(() => useGetFiresByUserUuid(mockUserUuid), { wrapper })

    await waitFor(() => {
      // Verify query is cached with correct key after the query completes
      const queryData = queryClient.getQueryData([
        EQueryKeyString.USER_FIRES,
        { userUuid: mockUserUuid },
      ])
      expect(queryData).toBeDefined()
    })
  })

  it("should handle empty fires array", async () => {
    mockedGetFiresByUserUuid.mockResolvedValue([])

    const { result } = renderHook(() => useGetFiresByUserUuid(mockUserUuid), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual([])
  })

  it("should refetch when userUuid changes", async () => {
    mockedGetFiresByUserUuid.mockResolvedValue(mockFiresData)

    const { result, rerender } = renderHook(
      ({ userUuid }: { userUuid: string | null }) =>
        useGetFiresByUserUuid(userUuid),
      {
        wrapper,
        initialProps: { userUuid: mockUserUuid },
      }
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockedGetFiresByUserUuid).toHaveBeenCalledTimes(1)

    // Change userUuid
    const newUserUuid = "new-user-uuid-456"
    const newMockData: TFireData[] = [
      {
        id: 3,
        type: EFireType.JOB_JOURNEY,
        ref_uuid: "job-journey-uuid-3",
        created_by: newUserUuid,
      },
    ]

    mockedGetFiresByUserUuid.mockResolvedValue(newMockData)

    rerender({ userUuid: newUserUuid })

    await waitFor(() => {
      expect(mockedGetFiresByUserUuid).toHaveBeenCalledTimes(2)
    })

    expect(mockedGetFiresByUserUuid).toHaveBeenLastCalledWith({
      uuid: newUserUuid,
    })
  })

  it("should not refetch when userUuid changes to null", async () => {
    mockedGetFiresByUserUuid.mockResolvedValue(mockFiresData)

    const { result, rerender } = renderHook(
      ({ userUuid }: { userUuid: string | null }) =>
        useGetFiresByUserUuid(userUuid),
      {
        wrapper,
        initialProps: { userUuid: mockUserUuid },
      }
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockedGetFiresByUserUuid).toHaveBeenCalledTimes(1)

    rerender({ userUuid: "" })

    // Should not trigger another API call
    expect(mockedGetFiresByUserUuid).toHaveBeenCalledTimes(1)
    // After changing to null, the query becomes disabled, so we don't check isLoading
    expect(result.current.isError).toBe(false)
  })
})
