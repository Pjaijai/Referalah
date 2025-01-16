class LocalStorageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "LocalStorageError"
  }
}

export const localStorage = {
  getItem: <T>(key: string): T | null => {
    if (typeof window === "undefined") return null
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error)
      return null
    }
  },

  setItem: <T>(key: string, value: T): void => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage:`, error)
      throw new LocalStorageError(`Failed to set item ${key} in localStorage`)
    }
  },

  removeItem: (key: string): void => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing item ${key} from localStorage:`, error)
      throw new LocalStorageError(
        `Failed to remove item ${key} from localStorage`
      )
    }
  },

  clear: (): void => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.clear()
    } catch (error) {
      console.error("Error clearing localStorage:", error)
      throw new LocalStorageError("Failed to clear localStorage")
    }
  },

  isAvailable: (): boolean => {
    try {
      window.localStorage.setItem("test", "test")
      window.localStorage.removeItem("test")
      return true
    } catch (e) {
      return false
    }
  },
}
