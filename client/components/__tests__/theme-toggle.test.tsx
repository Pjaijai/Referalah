/**
 * ThemeToggle component test
 *
 * @group unit
 */

import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { useTheme } from "next-themes"

import { ThemeToggle } from "@/components/theme-toggle"

// Mock the next-themes hook
jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}))

describe("ThemeToggle", () => {
  const mockSetTheme = jest.fn()

  beforeEach(() => {
    ;(useTheme as jest.Mock).mockReturnValue({
      setTheme: mockSetTheme,
      theme: "light",
    })
  })

  it("renders without crashing", () => {
    render(<ThemeToggle />)
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("displays the sun icon when theme is light", () => {
    render(<ThemeToggle />)
    expect(screen.getByText("Toggle theme")).toBeInTheDocument()
    expect(document.querySelector(".dark\\:hidden")).toBeInTheDocument()
  })

  it("displays the moon icon when theme is dark", () => {
    ;(useTheme as jest.Mock).mockReturnValue({
      setTheme: mockSetTheme,
      theme: "dark",
    })
    render(<ThemeToggle />)
    expect(screen.getByText("Toggle theme")).toBeInTheDocument()
    expect(document.querySelector(".dark\\:block")).toBeInTheDocument()
  })

  it("toggles theme when clicked", () => {
    render(<ThemeToggle />)
    const button = screen.getByRole("button")
    fireEvent.click(button)
    expect(mockSetTheme).toHaveBeenCalledWith("dark")
  })

  it("applies custom className when provided", () => {
    const customClass = "custom-class"
    render(<ThemeToggle className={customClass} />)
    expect(screen.getByRole("button")).toHaveClass(customClass)
  })
})
