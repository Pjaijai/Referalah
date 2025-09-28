import { ReactNode } from "react"
import { getCityList } from "@/utils/common/api"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"

import { ICityResponse } from "@/types/api/response/city"
import { EQueryKeyString } from "@/types/common/query-key-string"
import useGetCityList from "@/hooks/api/location/get-city-list"

// Mock the API function
jest.mock("@/utils/common/api", () => ({
  getCityList: jest.fn(),
}))

const mockedGetCityList = getCityList as jest.MockedFunction<typeof getCityList>

/**
 * useGetCityList hook test
 *
 * @group unit
 */

describe("useGetCityList", () => {
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

  const mockCityList: ICityResponse[] = [
    {
      id: 1,
      uuid: "hk-uuid",
      value: "hong-kong",
      english_name: "Hong Kong",
      cantonese_name: "香港",
      province_uuid: "china-uuid",
    },
    {
      id: 2,
      uuid: "nyc-uuid",
      value: "new-york-city",
      english_name: "New York City",
      cantonese_name: "紐約市",
      province_uuid: "ny-state-uuid",
    },
    {
      id: 3,
      uuid: "london-uuid",
      value: "london",
      english_name: "London",
      cantonese_name: "倫敦",
      province_uuid: "uk-uuid",
    },
  ]

  it("should call API and return city list data", async () => {
    mockedGetCityList.mockResolvedValue(mockCityList)

    const { result } = renderHook(() => useGetCityList(), {
      wrapper,
    })

    expect(mockedGetCityList).toHaveBeenCalled()

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockCityList)
  })

  it("should handle API errors gracefully", async () => {
    const errorMessage = "Failed to fetch city list"
    mockedGetCityList.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useGetCityList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(new Error(errorMessage))
    expect(result.current.data).toBeUndefined()
  })

  it("should be initially loading", () => {
    mockedGetCityList.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )

    const { result } = renderHook(() => useGetCityList(), {
      wrapper,
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()
  })

  it("should use correct query key", async () => {
    mockedGetCityList.mockResolvedValue(mockCityList)

    renderHook(() => useGetCityList(), { wrapper })

    await waitFor(() => {
      const queryData = queryClient.getQueryData([EQueryKeyString.CITY_LIST])
      expect(queryData).toBeDefined()
    })
  })

  it("should handle empty city list", async () => {
    mockedGetCityList.mockResolvedValue([])

    const { result } = renderHook(() => useGetCityList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual([])
  })

  it("should not refetch when component remounts due to refetchOnMount: false", async () => {
    mockedGetCityList.mockResolvedValue(mockCityList)

    // First render
    const { result: result1, unmount } = renderHook(() => useGetCityList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result1.current.isSuccess).toBe(true)
    })

    expect(mockedGetCityList).toHaveBeenCalledTimes(1)

    // Unmount the first hook
    unmount()

    // Create a new hook instance (simulating remount)
    const { result: result2 } = renderHook(() => useGetCityList(), {
      wrapper,
    })

    // Wait for the second hook to complete
    await waitFor(() => {
      expect(result2.current.isSuccess).toBe(true)
    })

    // Should still be only called once due to caching and refetchOnMount: false
    expect(mockedGetCityList).toHaveBeenCalledTimes(1)
  })

  it("should cache data properly", async () => {
    mockedGetCityList.mockResolvedValue(mockCityList)

    // First hook instance
    const { result: result1 } = renderHook(() => useGetCityList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result1.current.isSuccess).toBe(true)
    })

    expect(mockedGetCityList).toHaveBeenCalledTimes(1)
    expect(result1.current.data).toEqual(mockCityList)

    // Second hook instance should use cached data
    const { result: result2 } = renderHook(() => useGetCityList(), {
      wrapper,
    })

    // Should not call API again due to caching
    expect(mockedGetCityList).toHaveBeenCalledTimes(1)
    expect(result2.current.data).toEqual(mockCityList)
    expect(result2.current.isSuccess).toBe(true)
  })

  it("should call API only once even with multiple hook instances", async () => {
    mockedGetCityList.mockResolvedValue(mockCityList)

    // Create multiple hook instances simultaneously
    const { result: result1 } = renderHook(() => useGetCityList(), {
      wrapper,
    })
    const { result: result2 } = renderHook(() => useGetCityList(), {
      wrapper,
    })
    const { result: result3 } = renderHook(() => useGetCityList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result1.current.isSuccess).toBe(true)
      expect(result2.current.isSuccess).toBe(true)
      expect(result3.current.isSuccess).toBe(true)
    })

    // Should only call API once due to query deduplication
    expect(mockedGetCityList).toHaveBeenCalledTimes(1)
    expect(result1.current.data).toEqual(mockCityList)
    expect(result2.current.data).toEqual(mockCityList)
    expect(result3.current.data).toEqual(mockCityList)
  })

  it("should handle network timeouts", async () => {
    const timeoutError = new Error("Network timeout")
    mockedGetCityList.mockRejectedValue(timeoutError)

    const { result } = renderHook(() => useGetCityList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(timeoutError)
    expect(result.current.data).toBeUndefined()
  })

  it("should handle cities with different provinces", async () => {
    const cityListWithDifferentProvinces: ICityResponse[] = [
      {
        ...mockCityList[0],
        province_uuid: "guangdong-uuid", // Different province
      },
      {
        ...mockCityList[1],
        province_uuid: "new-york-state-uuid", // Different province
      },
      {
        ...mockCityList[2],
        province_uuid: "england-uuid", // Different province
      },
    ]

    mockedGetCityList.mockResolvedValue(cityListWithDifferentProvinces)

    const { result } = renderHook(() => useGetCityList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(cityListWithDifferentProvinces)
    expect(result.current.data).toHaveLength(3)
  })
})
