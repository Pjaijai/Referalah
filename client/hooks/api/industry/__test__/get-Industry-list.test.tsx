import { ReactNode } from "react"
import { getIndustryList } from "@/utils/common/api"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"

import { IIndustryResponse } from "@/types/api/response/industry"
import { EQueryKeyString } from "@/types/common/query-key-string"
import useGetIndustryList from "@/hooks/api/industry/get-Industry-list"

// Mock the API function
jest.mock("@/utils/common/api", () => ({
  getIndustryList: jest.fn(),
}))

const mockedGetIndustryList = getIndustryList as jest.MockedFunction<
  typeof getIndustryList
>

/**
 * useGetIndustryList hook test
 *
 * @group unit
 */

describe("useGetIndustryList", () => {
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

  const mockIndustryList: IIndustryResponse[] = [
    {
      id: 1,
      uuid: "uuid-1",
      value: "technology",
      english_name: "Technology",
      cantonese_name: "科技",
    },
    {
      id: 2,
      uuid: "uuid-2",
      value: "finance",
      english_name: "Finance",
      cantonese_name: "金融",
    },
    {
      id: 3,
      uuid: "uuid-3",
      value: "healthcare",
      english_name: "Healthcare",
      cantonese_name: "醫療",
    },
    {
      id: 4,
      uuid: "uuid-4",
      value: "education",
      english_name: "Education",
      cantonese_name: "教育",
    },
  ]

  it("should call API and return industry list data", async () => {
    mockedGetIndustryList.mockResolvedValue(mockIndustryList)

    const { result } = renderHook(() => useGetIndustryList(), {
      wrapper,
    })

    expect(mockedGetIndustryList).toHaveBeenCalled()

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockIndustryList)
  })

  it("should handle API errors gracefully", async () => {
    const errorMessage = "Failed to fetch industry list"
    mockedGetIndustryList.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useGetIndustryList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(new Error(errorMessage))
    expect(result.current.data).toBeUndefined()
  })

  it("should be initially loading", () => {
    mockedGetIndustryList.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )

    const { result } = renderHook(() => useGetIndustryList(), {
      wrapper,
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()
  })

  it("should use correct query key", async () => {
    mockedGetIndustryList.mockResolvedValue(mockIndustryList)

    renderHook(() => useGetIndustryList(), { wrapper })

    await waitFor(() => {
      const queryData = queryClient.getQueryData([
        EQueryKeyString.INDUSTRY_LIST,
      ])
      expect(queryData).toBeDefined()
    })
  })

  it("should handle empty industry list", async () => {
    mockedGetIndustryList.mockResolvedValue([])

    const { result } = renderHook(() => useGetIndustryList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual([])
  })

  it("should not refetch when component remounts due to refetchOnMount: false", async () => {
    mockedGetIndustryList.mockResolvedValue(mockIndustryList)

    // First render
    const { result: result1, unmount } = renderHook(
      () => useGetIndustryList(),
      {
        wrapper,
      }
    )

    await waitFor(() => {
      expect(result1.current.isSuccess).toBe(true)
    })

    expect(mockedGetIndustryList).toHaveBeenCalledTimes(1)

    // Unmount the first hook
    unmount()

    // Create a new hook instance (simulating remount)
    const { result: result2 } = renderHook(() => useGetIndustryList(), {
      wrapper,
    })

    // Wait a bit to see if it would call the API again
    await waitFor(() => {
      expect(result2.current.isSuccess).toBe(true)
    })

    // Should still be only called once due to caching and refetchOnMount: false
    expect(mockedGetIndustryList).toHaveBeenCalledTimes(1)
  })

  it("should cache data properly", async () => {
    mockedGetIndustryList.mockResolvedValue(mockIndustryList)

    // First hook instance
    const { result: result1 } = renderHook(() => useGetIndustryList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result1.current.isSuccess).toBe(true)
    })

    expect(mockedGetIndustryList).toHaveBeenCalledTimes(1)
    expect(result1.current.data).toEqual(mockIndustryList)

    // Second hook instance should use cached data
    const { result: result2 } = renderHook(() => useGetIndustryList(), {
      wrapper,
    })

    // Should not call API again due to caching
    expect(mockedGetIndustryList).toHaveBeenCalledTimes(1)
    expect(result2.current.data).toEqual(mockIndustryList)
    expect(result2.current.isSuccess).toBe(true)
  })

  it("should call API only once even with multiple hook instances", async () => {
    mockedGetIndustryList.mockResolvedValue(mockIndustryList)

    // Create multiple hook instances simultaneously
    const { result: result1 } = renderHook(() => useGetIndustryList(), {
      wrapper,
    })
    const { result: result2 } = renderHook(() => useGetIndustryList(), {
      wrapper,
    })
    const { result: result3 } = renderHook(() => useGetIndustryList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result1.current.isSuccess).toBe(true)
      expect(result2.current.isSuccess).toBe(true)
      expect(result3.current.isSuccess).toBe(true)
    })

    // Should only call API once due to query deduplication
    expect(mockedGetIndustryList).toHaveBeenCalledTimes(1)
    expect(result1.current.data).toEqual(mockIndustryList)
    expect(result2.current.data).toEqual(mockIndustryList)
    expect(result3.current.data).toEqual(mockIndustryList)
  })
})
