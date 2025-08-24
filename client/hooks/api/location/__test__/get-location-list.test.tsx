import { ReactNode } from "react"
import { getLocationList } from "@/utils/common/api"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"

import { TLocationData } from "@/types/api/response/location"
import { EQueryKeyString } from "@/types/common/query-key-string"
import useGetLocationList from "@/hooks/api/location/get-location-list"

// Mock the API function
jest.mock("@/utils/common/api", () => ({
  getLocationList: jest.fn(),
}))

const mockedGetLocationList = getLocationList as jest.MockedFunction<
  typeof getLocationList
>

describe("useGetLocationList", () => {
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

  const mockLocationList: TLocationData[] = [
    {
      id: 1,
      uuid: "toronto-uuid",
      value: "toronto",
      english_name: "Toronto",
      cantonese_name: "多倫多",
      level: 2,
      parent_uuid: "ontario-uuid",
      country_uuid: "canada-uuid",
      meta_data: {
        emoji: null,
      },
    },
    {
      id: 2,
      uuid: "vancouver-uuid",
      value: "vancouver",
      english_name: "Vancouver",
      cantonese_name: "溫哥華",
      level: 2,
      parent_uuid: "british-columbia-uuid",
      country_uuid: "canada-uuid",
      meta_data: {
        emoji: null,
      },
    },
    {
      id: 3,
      uuid: "new-york-uuid",
      value: "new-york",
      english_name: "New York",
      cantonese_name: "紐約",
      level: 2,
      parent_uuid: "new-york-state-uuid",
      country_uuid: "usa-uuid",
      meta_data: {
        emoji: null,
      },
    },
  ]

  it("should call API and return location list data", async () => {
    mockedGetLocationList.mockResolvedValue(mockLocationList)

    const { result } = renderHook(() => useGetLocationList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockedGetLocationList).toHaveBeenCalledTimes(1)
    expect(result.current.data).toEqual(mockLocationList)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe(false)
  })

  it("should handle empty location list", async () => {
    mockedGetLocationList.mockResolvedValue([])

    const { result } = renderHook(() => useGetLocationList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual([])
    expect(result.current.isLoading).toBe(false)
  })

  it("should handle API error", async () => {
    const errorMessage = "Failed to fetch locations"
    mockedGetLocationList.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useGetLocationList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(new Error(errorMessage))
    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBe(false)
  })

  it("should use correct query key", () => {
    const { result } = renderHook(() => useGetLocationList(), {
      wrapper,
    })

    expect(result.current).toBeDefined()

    // Check that the query was registered with the correct key
    const queries = queryClient.getQueryCache().getAll()
    const query = queries.find(
      (q) =>
        JSON.stringify(q.queryKey) ===
        JSON.stringify([EQueryKeyString.LOCATION_LIST])
    )
    expect(query).toBeDefined()
  })

  it("should not refetch on mount", () => {
    mockedGetLocationList.mockResolvedValue(mockLocationList)

    renderHook(() => useGetLocationList(), { wrapper })
    renderHook(() => useGetLocationList(), { wrapper })

    // Should only be called once despite multiple renders
    expect(mockedGetLocationList).toHaveBeenCalledTimes(1)
  })

  it("should not refetch on window focus", async () => {
    mockedGetLocationList.mockResolvedValue(mockLocationList)

    const { result } = renderHook(() => useGetLocationList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // Simulate window focus
    window.dispatchEvent(new Event("focus"))

    // Should still only be called once
    expect(mockedGetLocationList).toHaveBeenCalledTimes(1)
  })

  it("should handle network timeout", async () => {
    const timeoutError = new Error("Network timeout")
    timeoutError.name = "TimeoutError"
    mockedGetLocationList.mockRejectedValue(timeoutError)

    const { result } = renderHook(() => useGetLocationList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(timeoutError)
    expect(result.current.data).toBeUndefined()
  })

  it("should handle locations with empty cantonese names", async () => {
    const locationsWithEmptyCantonese: TLocationData[] = [
      {
        ...mockLocationList[0],
        cantonese_name: "",
      },
      {
        ...mockLocationList[1],
        cantonese_name: "",
      },
    ]

    mockedGetLocationList.mockResolvedValue(locationsWithEmptyCantonese)

    const { result } = renderHook(() => useGetLocationList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(locationsWithEmptyCantonese)
    expect(
      result.current.data?.every(
        (location) =>
          location.cantonese_name === "" && location.english_name !== ""
      )
    ).toBe(true)
  })

  it("should handle locations with different levels", async () => {
    const locationsWithDifferentLevels: TLocationData[] = [
      {
        ...mockLocationList[0],
        level: 0, // Country level
      },
      {
        ...mockLocationList[1],
        level: 1, // Province/State level
      },
      {
        ...mockLocationList[2],
        level: 2, // City level
      },
    ]

    mockedGetLocationList.mockResolvedValue(locationsWithDifferentLevels)

    const { result } = renderHook(() => useGetLocationList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(locationsWithDifferentLevels)
    expect(result.current.data?.map((loc) => loc.level)).toEqual([0, 1, 2])
  })

  it("should handle locations with null parent_uuid", async () => {
    const locationsWithNullParent: TLocationData[] = [
      {
        ...mockLocationList[0],
        parent_uuid: null, // Top-level location
      },
    ]

    mockedGetLocationList.mockResolvedValue(locationsWithNullParent)

    const { result } = renderHook(() => useGetLocationList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(locationsWithNullParent)
    expect(result.current.data?.[0]?.parent_uuid).toBeNull()
  })

  it("should handle locations with emoji metadata", async () => {
    const locationsWithEmoji: TLocationData[] = [
      {
        ...mockLocationList[0],
        meta_data: { emoji: "🍁" }, // Canada emoji
      },
      {
        ...mockLocationList[1],
        meta_data: { emoji: "🇺🇸" }, // USA emoji
      },
    ]

    mockedGetLocationList.mockResolvedValue(locationsWithEmoji)

    const { result } = renderHook(() => useGetLocationList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(locationsWithEmoji)
    expect(result.current.data?.[0]?.meta_data.emoji).toBe("🍁")
    expect(result.current.data?.[1]?.meta_data.emoji).toBe("🇺🇸")
  })
})
