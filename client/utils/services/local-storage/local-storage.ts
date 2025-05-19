/**
 * A generic and robust localStorage service for saving, retrieving, and managing data.
 */
export const localStorageService = {
  /**
   * Saves data to localStorage.
   * @param key - The key under which to store the data.
   * @param data - The data to store.
   * @returns boolean - True if the save operation was successful, false otherwise.
   */
  save<T>(key: string, data: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(data))
      return true
    } catch (error) {
      console.error(`Error saving to localStorage with key "${key}":`, error)
      return false
    }
  },

  /**
   * Retrieves data from localStorage.
   * @param key - The key of the data to retrieve.
   * @returns The stored data of type T, or null if not found or invalid.
   */
  get<T>(key: string): T | null {
    try {
      const rawData = localStorage.getItem(key)
      if (!rawData) {
        return null
      }

      return JSON.parse(rawData) as T
    } catch (error) {
      localStorage.removeItem(key) // Remove invalid data
      return null
    }
  },

  /**
   * Checks if data exists in localStorage.
   * @param key - The key to check.
   * @returns boolean - True if data exists, false otherwise.
   */
  has(key: string): boolean {
    try {
      const rawData = localStorage.getItem(key)
      if (!rawData) {
        return false
      }

      JSON.parse(rawData) // Ensure the data is valid JSON
      return true
    } catch (error) {
      console.error(`Error checking localStorage with key "${key}":`, error)
      localStorage.removeItem(key) // Remove invalid data
      return false
    }
  },

  /**
   * Removes data from localStorage.
   * @param key - The key of the data to remove.
   * @returns boolean - True if the remove operation was successful, false otherwise.
   */
  remove(key: string): boolean {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(
        `Error removing from localStorage with key "${key}":`,
        error
      )
      return false
    }
  },

  /**
   * Clears all data from localStorage.
   * @returns boolean - True if the clear operation was successful, false otherwise.
   */
  clear(): boolean {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error("Error clearing localStorage:", error)
      return false
    }
  },
}
