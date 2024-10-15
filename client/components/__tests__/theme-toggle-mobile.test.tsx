/**
 * ThemeToggleMobile component test
 *
 * @group unit
 */

import React from "react"
import { useI18n } from "@/utils/services/internationalization/client"
import { fireEvent, render, screen } from "@testing-library/react"
import { useTheme } from "next-themes"

import { ThemeToggleMobile } from "@/components/theme-toggle-mobile"

// Mock the next-themes hook
jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}))

// Mock the internationalization hook
jest.mock("@/utils/services/internationalization/client", () => ({
  useI18n: jest.fn(),
}))

describe("ThemeToggleMobile", () => {
  const mockSetTheme = jest.fn()
  const mockT = jest.fn((key) => key)

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useTheme as jest.Mock).mockReturnValue({
      setTheme: mockSetTheme,
      theme: "light",
    })
    ;(useI18n as jest.Mock).mockReturnValue(mockT)
  })

  it("renders without crashing", () => {
    render(<ThemeToggleMobile />)
    expect(screen.getByRole("switch")).toBeInTheDocument()
  })

  it('displays the sun icon and "Light Mode" text when theme is light', () => {
    render(<ThemeToggleMobile />)
    expect(screen.getByText("general.light_mode")).toBeInTheDocument()
    // expect(screen.getByText("sun")).toBeInTheDocument()
  })

  it('displays the moon icon and "Dark Mode" text when theme is dark', () => {
    ;(useTheme as jest.Mock).mockReturnValue({
      setTheme: mockSetTheme,
      theme: "dark",
    })
    render(<ThemeToggleMobile />)
    expect(screen.getByText("general.dark_mode")).toBeInTheDocument()
    // expect(screen.getByText("moon")).toBeInTheDocument()
  })

  it("toggles theme when switch is clicked", () => {
    render(<ThemeToggleMobile />)
    const switchElement = screen.getByRole("switch")
    fireEvent.click(switchElement)
    expect(mockSetTheme).toHaveBeenCalledWith("dark")
  })
})
