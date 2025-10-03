import { ReactNode } from "react"
import { searchCompanyByName } from "@/utils/common/api"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"

import { TCompanyData } from "@/types/api/company"
import useSearchCompanyByName from "@/hooks/api/company/search-company-by-name"

// Mock the API function
jest.mock("@/utils/common/api", () => ({
  searchCompanyByName: jest.fn(),
}))

const mockedSearchCompanyByName = searchCompanyByName as jest.MockedFunction<
  typeof searchCompanyByName
>

/**
 * useSearchCompanyByName hook test
 *
 * @group unit
 */

describe("useSearchCompanyByName", () => {
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

  const mockCompanyData: TCompanyData[] = [
    {
      id: 1,
      name: "Test Company 1",
      meta_data: {
        domain: "test1.com",
        logo_url: "https://example.com/logo1.png",
      },
    },
    {
      id: 2,
      name: "Test Company 2",
      meta_data: {
        domain: "test2.com",
        logo_url: "https://example.com/logo2.png",
      },
    },
  ]

  it("should not call API when searchTerm is empty", () => {
    const { result } = renderHook(
      () =>
        useSearchCompanyByName({
          searchTerm: "",
        }),
      { wrapper }
    )

    expect(mockedSearchCompanyByName).not.toHaveBeenCalled()
    expect(result.current.data).toBeUndefined()
  })

  it("should not call API when searchTerm is only whitespace", () => {
    const { result } = renderHook(
      () =>
        useSearchCompanyByName({
          searchTerm: "   ",
        }),
      { wrapper }
    )

    expect(mockedSearchCompanyByName).not.toHaveBeenCalled()
    expect(result.current.data).toBeUndefined()
  })

  it("should call API with trimmed searchTerm when valid term is provided", async () => {
    mockedSearchCompanyByName.mockResolvedValue(mockCompanyData)

    const { result } = renderHook(
      () =>
        useSearchCompanyByName({
          searchTerm: "  Test Company  ",
        }),
      { wrapper }
    )

    expect(mockedSearchCompanyByName).toHaveBeenCalledWith({
      searchTerm: "Test Company",
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockCompanyData)
  })

  it("should handle API errors gracefully", async () => {
    const errorMessage = "API Error"
    mockedSearchCompanyByName.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(
      () =>
        useSearchCompanyByName({
          searchTerm: "Test Company",
        }),
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(new Error(errorMessage))
  })

  it("should be initially loading when searchTerm is provided", () => {
    mockedSearchCompanyByName.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )

    const { result } = renderHook(
      () =>
        useSearchCompanyByName({
          searchTerm: "Test Company",
        }),
      { wrapper }
    )

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()
  })

  it("should use correct query key with trimmed search term", async () => {
    mockedSearchCompanyByName.mockResolvedValue(mockCompanyData)

    const searchTerm = "  Google  "
    const trimmedSearchTerm = "Google"

    const { result } = renderHook(
      () =>
        useSearchCompanyByName({
          searchTerm,
        }),
      { wrapper }
    )

    // Check that the query was called with trimmed term
    expect(mockedSearchCompanyByName).toHaveBeenCalledWith({
      searchTerm: trimmedSearchTerm,
    })

    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // Verify query is cached with correct key
    const queryData = queryClient.getQueryData([
      "searchCompanyByName",
      trimmedSearchTerm,
    ])

    expect(queryData).toEqual(mockCompanyData)
  })
})
