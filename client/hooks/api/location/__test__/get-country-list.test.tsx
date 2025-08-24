import { ReactNode } from "react"
import { getCountryList } from "@/utils/common/api"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"

import { ICountryResponse } from "@/types/api/response/country"
import { EQueryKeyString } from "@/types/common/query-key-string"
import useGetCountryList from "@/hooks/api/location/get-country-list"

// Mock the API function
jest.mock("@/utils/common/api", () => ({
  getCountryList: jest.fn(),
}))

const mockedGetCountryList = getCountryList as jest.MockedFunction<
  typeof getCountryList
>

/**
 * useGetCountryList hook test
 *
 * @group unit
 */

describe("useGetCountryList", () => {
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

  const mockCountryList: ICountryResponse[] = [
    {
      id: 1,
      uuid: "china-uuid",
      value: "china",
      english_name: "China",
      cantonese_name: "中國",
    },
    {
      id: 2,
      uuid: "usa-uuid",
      value: "united-states",
      english_name: "United States",
      cantonese_name: "美國",
    },
    {
      id: 3,
      uuid: "uk-uuid",
      value: "united-kingdom",
      english_name: "United Kingdom",
      cantonese_name: "英國",
    },
  ]

  it("should call API and return country list data", async () => {
    mockedGetCountryList.mockResolvedValue(mockCountryList)

    const { result } = renderHook(() => useGetCountryList(), {
      wrapper,
    })

    expect(mockedGetCountryList).toHaveBeenCalled()

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockCountryList)
  })

  it("should handle API errors gracefully", async () => {
    const errorMessage = "Failed to fetch country list"
    mockedGetCountryList.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useGetCountryList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(new Error(errorMessage))
    expect(result.current.data).toBeUndefined()
  })

  it("should be initially loading", () => {
    mockedGetCountryList.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )

    const { result } = renderHook(() => useGetCountryList(), {
      wrapper,
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()
  })

  it("should use correct query key", async () => {
    mockedGetCountryList.mockResolvedValue(mockCountryList)

    renderHook(() => useGetCountryList(), { wrapper })

    await waitFor(() => {
      const queryData = queryClient.getQueryData([EQueryKeyString.COUNTRY_LIST])
      expect(queryData).toBeDefined()
    })
  })

  it("should handle empty country list", async () => {
    mockedGetCountryList.mockResolvedValue([])

    const { result } = renderHook(() => useGetCountryList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual([])
  })

  it("should not refetch when component remounts due to refetchOnMount: false", async () => {
    mockedGetCountryList.mockResolvedValue(mockCountryList)

    // First render
    const { result: result1, unmount } = renderHook(() => useGetCountryList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result1.current.isSuccess).toBe(true)
    })

    expect(mockedGetCountryList).toHaveBeenCalledTimes(1)

    // Unmount the first hook
    unmount()

    // Create a new hook instance (simulating remount)
    const { result: result2 } = renderHook(() => useGetCountryList(), {
      wrapper,
    })

    // Wait for the second hook to complete
    await waitFor(() => {
      expect(result2.current.isSuccess).toBe(true)
    })

    // Should still be only called once due to caching and refetchOnMount: false
    expect(mockedGetCountryList).toHaveBeenCalledTimes(1)
  })

  it("should cache data properly", async () => {
    mockedGetCountryList.mockResolvedValue(mockCountryList)

    // First hook instance
    const { result: result1 } = renderHook(() => useGetCountryList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result1.current.isSuccess).toBe(true)
    })

    expect(mockedGetCountryList).toHaveBeenCalledTimes(1)
    expect(result1.current.data).toEqual(mockCountryList)

    // Second hook instance should use cached data
    const { result: result2 } = renderHook(() => useGetCountryList(), {
      wrapper,
    })

    // Should not call API again due to caching
    expect(mockedGetCountryList).toHaveBeenCalledTimes(1)
    expect(result2.current.data).toEqual(mockCountryList)
    expect(result2.current.isSuccess).toBe(true)
  })

  it("should call API only once even with multiple hook instances", async () => {
    mockedGetCountryList.mockResolvedValue(mockCountryList)

    // Create multiple hook instances simultaneously
    const { result: result1 } = renderHook(() => useGetCountryList(), {
      wrapper,
    })
    const { result: result2 } = renderHook(() => useGetCountryList(), {
      wrapper,
    })
    const { result: result3 } = renderHook(() => useGetCountryList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result1.current.isSuccess).toBe(true)
      expect(result2.current.isSuccess).toBe(true)
      expect(result3.current.isSuccess).toBe(true)
    })

    // Should only call API once due to query deduplication
    expect(mockedGetCountryList).toHaveBeenCalledTimes(1)
    expect(result1.current.data).toEqual(mockCountryList)
    expect(result2.current.data).toEqual(mockCountryList)
    expect(result3.current.data).toEqual(mockCountryList)
  })

  it("should handle network timeouts", async () => {
    const timeoutError = new Error("Network timeout")
    mockedGetCountryList.mockRejectedValue(timeoutError)

    const { result } = renderHook(() => useGetCountryList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(timeoutError)
    expect(result.current.data).toBeUndefined()
  })

  it("should handle countries with null cantonese names", async () => {
    const countriesWithNullCantonese: ICountryResponse[] = [
      {
        ...mockCountryList[0],
        cantonese_name: null,
      },
      {
        ...mockCountryList[1],
        cantonese_name: null,
      },
    ]

    mockedGetCountryList.mockResolvedValue(countriesWithNullCantonese)

    const { result } = renderHook(() => useGetCountryList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(countriesWithNullCantonese)
    expect(result.current.data).toHaveLength(2)
  })
})
