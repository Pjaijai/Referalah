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
    expect(result.current.hasConversationUnseen).toBe(false)
  })

  it("should set user information correctly", () => {
    const { result } = renderHook(() => useUserStore())

    act(() => {
      result.current.setUser({
        username: "testuser",
        uuid: "123456",
        photoUrl: "https://example.com/photo.jpg",
        status: EUserStatus.ACTIVE,
      })
    })

    expect(result.current.username).toBe("testuser")
    expect(result.current.isSignIn).toBe(true)
    expect(result.current.uuid).toBe("123456")
    expect(result.current.photoUrl).toBe("https://example.com/photo.jpg")
    expect(result.current.hasConversationUnseen).toBe(false)
  })

  it("should reset user information correctly", () => {
    const { result } = renderHook(() => useUserStore())

    act(() => {
      result.current.setUser({
        username: "testuser",
        uuid: "123456",
        photoUrl: "https://example.com/photo.jpg",
        status: EUserStatus.ACTIVE,
      })
    })

    act(() => {
      result.current.reSetUser()
    })

    expect(result.current.username).toBeNull()
    expect(result.current.isSignIn).toBe(false)
    expect(result.current.uuid).toBeNull()
    expect(result.current.photoUrl).toBeNull()
  })

  it("should set conversation seen status correctly", () => {
    const { result } = renderHook(() => useUserStore())

    act(() => {
      result.current.setConversationSeen(true)
    })

    expect(result.current.hasConversationUnseen).toBe(true)

    act(() => {
      result.current.setConversationSeen(false)
    })

    expect(result.current.hasConversationUnseen).toBe(false)
  })
})
