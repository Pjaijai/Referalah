import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"

import "@testing-library/jest-dom"
import { siteConfig } from "@/config/site"

import DonationCard from "../donation"

// Mock window.open
const mockWindowOpen = jest.fn()
Object.defineProperty(window, "open", {
  value: mockWindowOpen,
  writable: true,
})

/**
 * DonationCard component tests
 * @group unit
 */
describe("DonationCard", () => {
  beforeEach(() => {
    mockWindowOpen.mockClear()
  })

  it("renders with default props", () => {
    render(<DonationCard />)

    // Check if main elements are rendered
    expect(
      screen.getByRole("heading", { name: "Support Referalah" })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Help keep this platform running/)
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /Buy Me a Coffee/ })
    ).toBeInTheDocument()
  })

  it("renders with custom className", () => {
    const customClass = "custom-test-class"
    const { container } = render(<DonationCard className={customClass} />)

    const cardElement = container.firstChild as HTMLElement
    expect(cardElement).toHaveClass(customClass)
  })

  it("displays correct support information", () => {
    render(<DonationCard />)

    // Check for platform running fees text
    expect(screen.getByText(/Platform running fees/)).toBeInTheDocument()
    expect(screen.getByText(/hosting, domains, services/)).toBeInTheDocument()

    // Check for coffee for contributors text
    expect(
      screen.getByText(/Coffee for contributors and maintainers/)
    ).toBeInTheDocument()

    // Check for bonus information
    expect(screen.getByText(/✨ Bonus:/)).toBeInTheDocument()
    expect(
      screen.getByText(/shoutout on Referalah's Instagram and Threads/)
    ).toBeInTheDocument()
  })

  it("displays coffee icons", () => {
    render(<DonationCard />)

    // Check for coffee icons (using lucide-react Coffee component)
    const coffeeIcons = screen.getAllByTestId("lucide-coffee")
    expect(coffeeIcons).toHaveLength(2) // One in the header circle, one in the button
  })

  it("displays external link icon in button", () => {
    render(<DonationCard />)

    expect(screen.getByTestId("lucide-external-link")).toBeInTheDocument()
  })

  it("opens donation link when button is clicked", () => {
    render(<DonationCard />)

    const donateButton = screen.getByRole("button", { name: /Buy Me a Coffee/ })
    fireEvent.click(donateButton)

    expect(mockWindowOpen).toHaveBeenCalledWith(
      siteConfig.links.buyMeACoffee,
      "_blank",
      "noopener,noreferrer"
    )
  })

  it("uses correct donation URL from site config", () => {
    render(<DonationCard />)

    const donateButton = screen.getByRole("button", { name: /Buy Me a Coffee/ })
    fireEvent.click(donateButton)

    expect(mockWindowOpen).toHaveBeenCalledWith(
      "https://buymeacoffee.com/paulwong169",
      "_blank",
      "noopener,noreferrer"
    )
  })

  it("has proper styling classes", () => {
    const { container } = render(<DonationCard />)

    const cardElement = container.firstChild as HTMLElement
    expect(cardElement).toHaveClass(
      "w-full",
      "rounded-lg",
      "border-2",
      "border-indigo-200",
      "bg-gradient-to-br",
      "from-indigo-50",
      "to-indigo-100"
    )
  })

  it("has accessible button with proper styling", () => {
    render(<DonationCard />)

    const donateButton = screen.getByRole("button", { name: /Buy Me a Coffee/ })
    expect(donateButton).toHaveClass(
      "flex",
      "w-full",
      "items-center",
      "justify-center",
      "bg-indigo-600"
    )
  })

  it("has proper bullet points styling", () => {
    render(<DonationCard />)

    // Check that bullet points are rendered (they should be small colored circles)
    const bulletPoints = document.querySelectorAll(
      ".h-2.w-2.rounded-full.bg-indigo-400"
    )
    expect(bulletPoints).toHaveLength(2)
  })

  it("handles click event properly", () => {
    const { container } = render(<DonationCard />)

    // Ensure no errors are thrown when clicking
    const donateButton = screen.getByRole("button", { name: /Buy Me a Coffee/ })
    expect(() => fireEvent.click(donateButton)).not.toThrow()
  })

  it("renders heading with correct level", () => {
    render(<DonationCard />)

    const heading = screen.getByRole("heading", { name: "Support Referalah" })
    expect(heading).toBeInTheDocument()
    expect(heading.tagName).toBe("H3")
  })

  it("has responsive layout structure", () => {
    render(<DonationCard />)

    // Check for main content sections
    expect(document.querySelector(".space-y-4")).toBeInTheDocument()
    expect(document.querySelector(".text-center")).toBeInTheDocument()
    expect(document.querySelector(".text-left")).toBeInTheDocument()
  })
})
