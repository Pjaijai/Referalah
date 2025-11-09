import React from "react"
import { useI18n } from "@/utils/services/internationalization/client"
import { render, screen } from "@testing-library/react"

import LinkTooltip from "./link"

// Mock internationalization
jest.mock("@/utils/services/internationalization/client", () => ({
  useI18n: jest.fn(),
}))

// Mock Firebase to prevent IndexedDB errors
jest.mock("@/utils/services/firebase/config", () => ({
  firebase: {},
  remoteConfig: null,
}))

// Mock Supabase
jest.mock("@/utils/services/supabase/config", () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getSession: jest.fn(),
    },
  },
}))

// Mock Next.js Link
jest.mock("next/link", () => {
  return function MockLink({ children, href, target, className }: any) {
    return (
      <a
        href={href}
        target={target}
        className={className}
        data-testid="next-link"
      >
        {children}
      </a>
    )
  }
})

// Mock Icons
jest.mock("@/components/icons", () => ({
  Icons: {
    link: function MockLinkIcon() {
      return <svg data-testid="link-icon" className="lucide-link" />
    },
  },
}))

// Mock UI components
jest.mock("@/components/ui/tooltip", () => ({
  TooltipProvider: ({ children }: any) => (
    <div data-testid="tooltip-provider">{children}</div>
  ),
  Tooltip: ({ children }: any) => <div data-testid="tooltip">{children}</div>,
  TooltipTrigger: ({ children }: any) => (
    <div data-testid="tooltip-trigger">{children}</div>
  ),
  TooltipContent: ({ children }: any) => (
    <div data-testid="tooltip-content">{children}</div>
  ),
}))

// Mock button variants
jest.mock("@/components/ui/button", () => ({
  buttonVariants: jest.fn(({ variant, className }: any) => {
    return `button-${variant} ${className || ""}`
  }),
}))

// Mock cn utility
jest.mock("@/lib/utils", () => ({
  cn: jest.fn((...classes: any[]) => classes.filter(Boolean).join(" ")),
}))

const mockUseI18n = useI18n as jest.MockedFunction<typeof useI18n>

/**
 * LinkTooltip component tests
 * @group unit
 */
describe("LinkTooltip", () => {
  const mockT = jest.fn((key: string) => {
    const translations: Record<string, string> = {
      "general.link": "Link",
    }
    return translations[key] || key
  })

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseI18n.mockReturnValue(mockT)
  })

  describe("Rendering", () => {
    it("should render tooltip provider", () => {
      render(<LinkTooltip url="https://example.com" />)

      expect(screen.getByTestId("tooltip-provider")).toBeInTheDocument()
    })

    it("should render tooltip", () => {
      render(<LinkTooltip url="https://example.com" />)

      expect(screen.getByTestId("tooltip")).toBeInTheDocument()
    })

    it("should render tooltip trigger", () => {
      render(<LinkTooltip url="https://example.com" />)

      expect(screen.getByTestId("tooltip-trigger")).toBeInTheDocument()
    })

    it("should render tooltip content", () => {
      render(<LinkTooltip url="https://example.com" />)

      expect(screen.getByTestId("tooltip-content")).toBeInTheDocument()
    })

    it("should render link icon", () => {
      render(<LinkTooltip url="https://example.com" />)

      expect(screen.getByTestId("link-icon")).toBeInTheDocument()
    })

    it("should render link text", () => {
      render(<LinkTooltip url="https://example.com" />)

      expect(screen.getByText("Link")).toBeInTheDocument()
    })
  })

  describe("Link Component", () => {
    it("should render Next.js Link", () => {
      render(<LinkTooltip url="https://example.com" />)

      expect(screen.getByTestId("next-link")).toBeInTheDocument()
    })

    it("should set correct href attribute", () => {
      render(<LinkTooltip url="https://example.com" />)

      const link = screen.getByTestId("next-link")
      expect(link).toHaveAttribute("href", "https://example.com")
    })

    it("should open in new tab", () => {
      render(<LinkTooltip url="https://example.com" />)

      const link = screen.getByTestId("next-link")
      expect(link).toHaveAttribute("target", "_blank")
    })

    it("should apply button variant classes", () => {
      render(<LinkTooltip url="https://example.com" />)

      const link = screen.getByTestId("next-link")
      expect(link).toHaveClass("button-ghost")
    })

    it("should apply gap-2 class", () => {
      render(<LinkTooltip url="https://example.com" />)

      const link = screen.getByTestId("next-link")
      expect(link.className).toContain("gap-2")
    })
  })

  describe("Tooltip Content", () => {
    it("should display url in tooltip content", () => {
      render(<LinkTooltip url="https://example.com" />)

      const tooltipContent = screen.getByTestId("tooltip-content")
      expect(tooltipContent).toHaveTextContent("https://example.com")
    })

    it("should handle different urls", () => {
      const { rerender } = render(<LinkTooltip url="https://github.com/user" />)

      expect(screen.getByTestId("tooltip-content")).toHaveTextContent(
        "https://github.com/user"
      )

      rerender(<LinkTooltip url="https://linkedin.com/in/profile" />)

      expect(screen.getByTestId("tooltip-content")).toHaveTextContent(
        "https://linkedin.com/in/profile"
      )
    })

    it("should display url with trailing space", () => {
      render(<LinkTooltip url="https://example.com" />)

      // The component adds a trailing space in the tooltip content
      const tooltipContent = screen.getByTestId("tooltip-content")
      expect(tooltipContent.textContent).toBe("https://example.com ")
    })
  })

  describe("Props", () => {
    it("should accept url prop", () => {
      render(<LinkTooltip url="https://example.com" />)

      const link = screen.getByTestId("next-link")
      expect(link).toHaveAttribute("href", "https://example.com")
    })

    it("should handle https urls", () => {
      render(<LinkTooltip url="https://secure.example.com" />)

      const link = screen.getByTestId("next-link")
      expect(link).toHaveAttribute("href", "https://secure.example.com")
    })

    it("should handle http urls", () => {
      render(<LinkTooltip url="http://example.com" />)

      const link = screen.getByTestId("next-link")
      expect(link).toHaveAttribute("href", "http://example.com")
    })

    it("should handle urls with paths", () => {
      render(<LinkTooltip url="https://example.com/path/to/page" />)

      const link = screen.getByTestId("next-link")
      expect(link).toHaveAttribute("href", "https://example.com/path/to/page")
    })

    it("should handle urls with query parameters", () => {
      render(<LinkTooltip url="https://example.com?param=value&foo=bar" />)

      const link = screen.getByTestId("next-link")
      expect(link).toHaveAttribute(
        "href",
        "https://example.com?param=value&foo=bar"
      )
    })

    it("should handle urls with hash fragments", () => {
      render(<LinkTooltip url="https://example.com#section" />)

      const link = screen.getByTestId("next-link")
      expect(link).toHaveAttribute("href", "https://example.com#section")
    })
  })

  describe("Internationalization", () => {
    it("should call useI18n hook", () => {
      render(<LinkTooltip url="https://example.com" />)

      expect(mockUseI18n).toHaveBeenCalled()
    })

    it("should translate link text", () => {
      render(<LinkTooltip url="https://example.com" />)

      expect(mockT).toHaveBeenCalledWith("general.link")
      expect(screen.getByText("Link")).toBeInTheDocument()
    })

    it("should use translated text in link", () => {
      mockT.mockReturnValue("連結")

      render(<LinkTooltip url="https://example.com" />)

      expect(screen.getByText("連結")).toBeInTheDocument()
    })
  })

  describe("Tooltip Structure", () => {
    it("should have TooltipProvider as root", () => {
      const { container } = render(<LinkTooltip url="https://example.com" />)

      const provider = container.querySelector(
        '[data-testid="tooltip-provider"]'
      )
      expect(provider).toBeInTheDocument()
    })

    it("should have Tooltip inside TooltipProvider", () => {
      render(<LinkTooltip url="https://example.com" />)

      const provider = screen.getByTestId("tooltip-provider")
      const tooltip = screen.getByTestId("tooltip")
      expect(provider).toContainElement(tooltip)
    })

    it("should have TooltipTrigger and TooltipContent inside Tooltip", () => {
      render(<LinkTooltip url="https://example.com" />)

      const tooltip = screen.getByTestId("tooltip")
      const trigger = screen.getByTestId("tooltip-trigger")
      const content = screen.getByTestId("tooltip-content")

      expect(tooltip).toContainElement(trigger)
      expect(tooltip).toContainElement(content)
    })

    it("should have Link inside TooltipTrigger", () => {
      render(<LinkTooltip url="https://example.com" />)

      const trigger = screen.getByTestId("tooltip-trigger")
      const link = screen.getByTestId("next-link")

      expect(trigger).toContainElement(link)
    })
  })

  describe("Icon", () => {
    it("should render link icon with lucide class", () => {
      render(<LinkTooltip url="https://example.com" />)

      const icon = screen.getByTestId("link-icon")
      expect(icon).toHaveClass("lucide-link")
    })

    it("should render icon before text", () => {
      const { container } = render(<LinkTooltip url="https://example.com" />)

      const link = screen.getByTestId("next-link")
      const children = Array.from(link.children)

      expect(children[0]).toHaveAttribute("data-testid", "link-icon")
    })
  })

  describe("Edge Cases", () => {
    it("should handle empty url", () => {
      render(<LinkTooltip url="" />)

      const link = screen.getByTestId("next-link")
      expect(link).toHaveAttribute("href", "")
    })

    it("should handle very long urls", () => {
      const longUrl = `https://example.com/${"very-long-path/".repeat(50)}`
      render(<LinkTooltip url={longUrl} />)

      const link = screen.getByTestId("next-link")
      expect(link).toHaveAttribute("href", longUrl)
    })

    it("should handle urls with special characters", () => {
      const specialUrl = "https://example.com/path?param=value&special=!@#$%"
      render(<LinkTooltip url={specialUrl} />)

      const link = screen.getByTestId("next-link")
      expect(link).toHaveAttribute("href", specialUrl)
    })

    it("should handle urls with unicode characters", () => {
      const unicodeUrl = "https://example.com/路径/页面"
      render(<LinkTooltip url={unicodeUrl} />)

      const link = screen.getByTestId("next-link")
      expect(link).toHaveAttribute("href", unicodeUrl)
    })

    it("should render all elements even with minimal url", () => {
      render(<LinkTooltip url="/" />)

      expect(screen.getByTestId("tooltip-provider")).toBeInTheDocument()
      expect(screen.getByTestId("tooltip")).toBeInTheDocument()
      expect(screen.getByTestId("tooltip-trigger")).toBeInTheDocument()
      expect(screen.getByTestId("tooltip-content")).toBeInTheDocument()
      expect(screen.getByTestId("next-link")).toBeInTheDocument()
      expect(screen.getByTestId("link-icon")).toBeInTheDocument()
    })
  })

  describe("Styling", () => {
    it("should apply ghost button variant", () => {
      const { buttonVariants } = require("@/components/ui/button")

      render(<LinkTooltip url="https://example.com" />)

      expect(buttonVariants).toHaveBeenCalledWith({
        variant: "ghost",
        className: "gap-2",
      })
    })

    it("should use cn utility for className", () => {
      const { cn } = require("@/lib/utils")

      render(<LinkTooltip url="https://example.com" />)

      expect(cn).toHaveBeenCalled()
    })
  })
})
