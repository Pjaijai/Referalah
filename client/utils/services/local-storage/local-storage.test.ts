/**
 * localStorageService test
 *
 * @group unit
 */

import { localStorageService } from "@/utils/services/local-storage/local-storage"

describe("localStorageService", () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  describe("save", () => {
    it("should save data to localStorage and return true", () => {
      const key = "testKey"
      const data = { value: "test" }
      const result = localStorageService.save(key, data)
      expect(result).toBe(true)
      expect(localStorage.getItem(key)).toBe(JSON.stringify(data))
    })

    it("should return false and log error if saving fails", () => {
      const key = "testKey"
      const data = { value: "test" }
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {})
      const setItemSpy = jest
        .spyOn(Storage.prototype, "setItem")
        .mockImplementation(() => {
          throw new Error("Storage error")
        })
      const result = localStorageService.save(key, data)
      expect(result).toBe(false)
      expect(consoleSpy).toHaveBeenCalledWith(
        `Error saving to localStorage with key "${key}":`,
        expect.any(Error)
      )
      consoleSpy.mockRestore()
      setItemSpy.mockRestore()
    })
  })

  describe("get", () => {
    it("should retrieve data from localStorage", () => {
      const key = "testKey"
      const data = { value: "test" }
      localStorage.setItem(key, JSON.stringify(data))
      const result = localStorageService.get<{ value: string }>(key)
      expect(result).toEqual(data)
    })

    it("should return null if key does not exist", () => {
      const result = localStorageService.get("nonExistentKey")
      expect(result).toBeNull()
    })

    it("should return null and remove invalid data if parsing fails", () => {
      const key = "testKey"
      localStorage.setItem(key, "invalid JSON")
      const result = localStorageService.get(key)
      expect(result).toBeNull()
      expect(localStorage.getItem(key)).toBeNull()
    })
  })

  describe("has", () => {
    it("should return true if valid data exists", () => {
      const key = "testKey"
      const data = { value: "test" }
      localStorage.setItem(key, JSON.stringify(data))
      const result = localStorageService.has(key)
      expect(result).toBe(true)
    })

    it("should return false if key does not exist", () => {
      const result = localStorageService.has("nonExistentKey")
      expect(result).toBe(false)
    })

    it("should return false and remove invalid data if parsing fails", () => {
      const key = "testKey"
      localStorage.setItem(key, "invalid JSON")
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {})
      const result = localStorageService.has(key)
      expect(result).toBe(false)
      expect(localStorage.getItem(key)).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith(
        `Error checking localStorage with key "${key}":`,
        expect.any(Error)
      )
      consoleSpy.mockRestore()
    })
  })

  describe("remove", () => {
    it("should remove data from localStorage and return true", () => {
      const key = "testKey"
      localStorage.setItem(key, JSON.stringify({ value: "test" }))
      const result = localStorageService.remove(key)
      expect(result).toBe(true)
      expect(localStorage.getItem(key)).toBeNull()
    })

    it("should return false and log error if removal fails", () => {
      const key = "testKey"
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {})
      const removeItemSpy = jest
        .spyOn(Storage.prototype, "removeItem")
        .mockImplementation(() => {
          throw new Error("Removal error")
        })
      const result = localStorageService.remove(key)
      expect(result).toBe(false)
      expect(consoleSpy).toHaveBeenCalledWith(
        `Error removing from localStorage with key "${key}":`,
        expect.any(Error)
      )
      consoleSpy.mockRestore()
      removeItemSpy.mockRestore()
    })
  })

  describe("clear", () => {
    it("should clear all data from localStorage and return true", () => {
      localStorage.setItem("key1", JSON.stringify({ value: "test1" }))
      localStorage.setItem("key2", JSON.stringify({ value: "test2" }))
      const result = localStorageService.clear()
      expect(result).toBe(true)
      expect(localStorage.length).toBe(0)
    })

    it("should return false and log error if clearing fails", () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {})
      const clearSpy = jest
        .spyOn(Storage.prototype, "clear")
        .mockImplementation(() => {
          throw new Error("Clear error")
        })
      const result = localStorageService.clear()
      expect(result).toBe(false)
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error clearing localStorage:",
        expect.any(Error)
      )
      consoleSpy.mockRestore()
      clearSpy.mockRestore()
    })
  })
})
