import { act, renderHook } from "@testing-library/react"

import { EUserStatus } from "@/types/common/user-status"
import useUserStore from "@/hooks/state/user/store"

/**
 * useUserStore hook test
 *
 * @group unit
 */

describe("useUserStore", () => {
  beforeEach(() => {
    // Reset the store before each test
    act(() => {
      useUserStore.getState().reSetUser()
    })
  })

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useUserStore())

    expect(result.current.username).toBeNull()
    expect(result.current.isSignIn).toBe(false)
    expect(result.current.uuid).toBeNull()
    expect(result.current.photoUrl).toBeNull()
    expect(result.current.status).toBeNull()
    expect(result.current.description).toBeNull()
    expect(result.current.hasLinkedInVerification).toBe(false)
  })

  it("should set user information correctly", () => {
    const { result } = renderHook(() => useUserStore())

    act(() => {
      result.current.setUser({
        username: "testuser",
        uuid: "123456",
        photoUrl: "https://example.com/photo.jpg",
        status: EUserStatus.ACTIVE,
        description: "Test description",
        hasLinkedInVerification: true,
      })
    })

    expect(result.current.username).toBe("testuser")
    expect(result.current.isSignIn).toBe(true)
    expect(result.current.uuid).toBe("123456")
    expect(result.current.photoUrl).toBe("https://example.com/photo.jpg")
    expect(result.current.status).toBe(EUserStatus.ACTIVE)
    expect(result.current.description).toBe("Test description")
    expect(result.current.hasLinkedInVerification).toBe(true)
  })

  it("should reset user information correctly", () => {
    const { result } = renderHook(() => useUserStore())

    act(() => {
      result.current.setUser({
        username: "testuser",
        uuid: "123456",
        photoUrl: "https://example.com/photo.jpg",
        status: EUserStatus.ACTIVE,
        description: "Test description",
        hasLinkedInVerification: true,
      })
    })

    act(() => {
      result.current.reSetUser()
    })

    expect(result.current.username).toBeNull()
    expect(result.current.isSignIn).toBe(false)
    expect(result.current.uuid).toBeNull()
    expect(result.current.photoUrl).toBeNull()
    expect(result.current.status).toBeNull()
    expect(result.current.description).toBeNull()
    expect(result.current.hasLinkedInVerification).toBe(false)
  })

  it("should handle description and LinkedIn verification correctly", () => {
    const { result } = renderHook(() => useUserStore())

    // Test with description and no LinkedIn verification
    act(() => {
      result.current.setUser({
        username: "testuser",
        uuid: "123456",
        photoUrl: null,
        status: EUserStatus.ACTIVE,
        description: "Software Engineer with 5 years experience",
        hasLinkedInVerification: false,
      })
    })

    expect(result.current.description).toBe(
      "Software Engineer with 5 years experience"
    )
    expect(result.current.hasLinkedInVerification).toBe(false)

    // Test with no description but has LinkedIn verification
    act(() => {
      result.current.setUser({
        username: "testuser2",
        uuid: "789012",
        photoUrl: null,
        status: EUserStatus.ACTIVE,
        description: null,
        hasLinkedInVerification: true,
      })
    })

    expect(result.current.description).toBeNull()
    expect(result.current.hasLinkedInVerification).toBe(true)
  })
})
