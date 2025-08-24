import { ReactNode } from "react"
import { getProvinceList } from "@/utils/common/api"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"

import { IProvinceResponse } from "@/types/api/response/province"
import { EQueryKeyString } from "@/types/common/query-key-string"
import useGetProvinceList from "@/hooks/api/location/get-province-list"

// Mock the API function
jest.mock("@/utils/common/api", () => ({
  getProvinceList: jest.fn(),
}))

const mockedGetProvinceList = getProvinceList as jest.MockedFunction<
  typeof getProvinceList
>

describe("useGetProvinceList", () => {
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

  const mockProvinceList: IProvinceResponse[] = [
    {
      id: 1,
      uuid: "ontario-uuid",
      value: "ontario",
      english_name: "Ontario",
      cantonese_name: "安大略省",
      country_uuid: "canada-uuid",
    },
    {
      id: 2,
      uuid: "british-columbia-uuid",
      value: "british-columbia",
      english_name: "British Columbia",
      cantonese_name: "卑詩省",
      country_uuid: "canada-uuid",
    },
    {
      id: 3,
      uuid: "california-uuid",
      value: "california",
      english_name: "California",
      cantonese_name: "加利福尼亞州",
      country_uuid: "usa-uuid",
    },
  ]

  it("should call API and return province list data", async () => {
    mockedGetProvinceList.mockResolvedValue(mockProvinceList)

    const { result } = renderHook(() => useGetProvinceList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockedGetProvinceList).toHaveBeenCalledTimes(1)
    expect(result.current.data).toEqual(mockProvinceList)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe(false)
  })

  it("should handle empty province list", async () => {
    mockedGetProvinceList.mockResolvedValue([])

    const { result } = renderHook(() => useGetProvinceList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual([])
    expect(result.current.isLoading).toBe(false)
  })

  it("should handle API error", async () => {
    const errorMessage = "Failed to fetch provinces"
    mockedGetProvinceList.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useGetProvinceList(), {
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
    const { result } = renderHook(() => useGetProvinceList(), {
      wrapper,
    })

    expect(result.current).toBeDefined()

    // Check that the query was registered with the correct key
    const queries = queryClient.getQueryCache().getAll()
    const query = queries.find(
      (q) =>
        JSON.stringify(q.queryKey) ===
        JSON.stringify([EQueryKeyString.PROVINCE_LIST])
    )
    expect(query).toBeDefined()
  })

  it("should not refetch on mount", () => {
    mockedGetProvinceList.mockResolvedValue(mockProvinceList)

    renderHook(() => useGetProvinceList(), { wrapper })
    renderHook(() => useGetProvinceList(), { wrapper })

    // Should only be called once despite multiple renders
    expect(mockedGetProvinceList).toHaveBeenCalledTimes(1)
  })

  it("should not refetch on window focus", async () => {
    mockedGetProvinceList.mockResolvedValue(mockProvinceList)

    const { result } = renderHook(() => useGetProvinceList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // Simulate window focus
    window.dispatchEvent(new Event("focus"))

    // Should still only be called once
    expect(mockedGetProvinceList).toHaveBeenCalledTimes(1)
  })

  it("should handle network timeout", async () => {
    const timeoutError = new Error("Network timeout")
    timeoutError.name = "TimeoutError"
    mockedGetProvinceList.mockRejectedValue(timeoutError)

    const { result } = renderHook(() => useGetProvinceList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(timeoutError)
    expect(result.current.data).toBeUndefined()
  })

  it("should handle provinces with null cantonese names", async () => {
    const provincesWithNullCantonese: IProvinceResponse[] = [
      {
        ...mockProvinceList[0],
        cantonese_name: null,
      },
      {
        ...mockProvinceList[1],
        cantonese_name: null,
      },
    ]

    mockedGetProvinceList.mockResolvedValue(provincesWithNullCantonese)

    const { result } = renderHook(() => useGetProvinceList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(provincesWithNullCantonese)
    expect(
      result.current.data?.every(
        (province) =>
          province.cantonese_name === null && province.english_name !== null
      )
    ).toBe(true)
  })

  it("should handle provinces with null country_uuid", async () => {
    const provincesWithNullCountry: IProvinceResponse[] = [
      {
        ...mockProvinceList[0],
        country_uuid: null,
      },
    ]

    mockedGetProvinceList.mockResolvedValue(provincesWithNullCountry)

    const { result } = renderHook(() => useGetProvinceList(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(provincesWithNullCountry)
    expect(result.current.data?.[0]?.country_uuid).toBeNull()
  })
})
