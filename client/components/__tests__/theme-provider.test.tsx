/**
 * ThemeProvider component test
 *
 * @group unit
 */

import React from "react"
import { render } from "@testing-library/react"
import { useTheme } from "next-themes"

import { ThemeProvider } from "@/components/theme-provider"

// Mock the next-themes library
jest.mock("next-themes", () => ({
  ThemeProvider: jest.fn(({ children }) => (
    <div data-testid="mock-theme-provider">{children}</div>
  )),
  useTheme: jest.fn(),
}))

describe("ThemeProvider", () => {
  it("renders children without crashing", () => {
    const { getByText } = render(
      <ThemeProvider>
        <div>Test Child</div>
      </ThemeProvider>
    )
    expect(getByText("Test Child")).toBeInTheDocument()
  })

  it("provides theme context to children", () => {
    const MockChild = () => {
      const { theme } = useTheme()
      return <div>{theme}</div>
    }

    ;(useTheme as jest.Mock).mockReturnValue({ theme: "light" })

    const { getByText } = render(
      <ThemeProvider>
        <MockChild />
      </ThemeProvider>
    )

    expect(getByText("light")).toBeInTheDocument()
  })
})
