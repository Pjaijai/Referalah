import React from "react"
import { useI18n } from "@/utils/services/internationalization/client"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { FormProvider, useForm } from "react-hook-form"

import { ESocialLink } from "@/types/common/social-links"

import SocialLinksSection from "./social-links"

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

// Mock hooks
jest.mock("@/hooks/common/get-social-links-options", () => ({
  useGetSocialLinkOptions: jest.fn(),
}))

// Mock child components
jest.mock("@/modules/profile/components/sections/base/base", () => {
  return function MockBaseSection({ title, children }: any) {
    return (
      <div data-testid="base-section">
        <h2 data-testid="section-title">{title}</h2>
        {children}
      </div>
    )
  }
})

jest.mock("@/components/customized-ui/selects/base", () => {
  return function MockBaseSelect({ options, value, onChange, ...props }: any) {
    return (
      <select
        data-testid="base-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      >
        {options?.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    )
  }
})

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, type, ...props }: any) => (
    <button onClick={onClick} type={type} data-testid="button" {...props}>
      {children}
    </button>
  ),
}))

jest.mock("@/components/ui/input", () => {
  const MockInput = React.forwardRef(({ ...props }: any, ref: any) => (
    <input ref={ref} data-testid="input" {...props} />
  ))
  MockInput.displayName = "MockInput"
  return { Input: MockInput }
})

jest.mock("@/components/ui/form", () => ({
  FormControl: ({ children }: any) => (
    <div data-testid="form-control">{children}</div>
  ),
  FormField: ({ control, name, render }: any) => {
    const Comp = render({
      field: { name, onChange: jest.fn(), onBlur: jest.fn(), value: "" },
    })
    return <div data-testid={`form-field-${name}`}>{Comp}</div>
  },
  FormItem: ({ children }: any) => (
    <div data-testid="form-item">{children}</div>
  ),
  FormLabel: ({ children }: any) => (
    <label data-testid="form-label">{children}</label>
  ),
  FormMessage: () => <span data-testid="form-message" />,
}))

jest.mock("@/components/icons", () => ({
  Icons: {
    trashBin: ({ size, className }: any) => (
      <svg data-testid="trash-icon" data-size={size} className={className}>
        trash
      </svg>
    ),
  },
}))

const mockUseI18n = useI18n as jest.MockedFunction<typeof useI18n>
const mockUseGetSocialLinkOptions =
  require("@/hooks/common/get-social-links-options")
    .useGetSocialLinkOptions as jest.MockedFunction<any>

// Wrapper component to provide form context
function TestWrapper({ children, defaultValues = {} }: any) {
  const methods = useForm({
    defaultValues: {
      links: [],
      ...defaultValues,
    },
  })
  return <FormProvider {...methods}>{children(methods)}</FormProvider>
}

/**
 * SocialLinksSection component tests
 * @group unit
 */
describe("SocialLinksSection", () => {
  const mockSocialLinkOptions = [
    { value: ESocialLink.LINKEDIN, label: "LinkedIn" },
    { value: ESocialLink.GITHUB, label: "GitHub" },
    { value: ESocialLink.INSTAGRAM, label: "Instagram" },
    { value: ESocialLink.CUSTOM, label: "Custom" },
  ]

  const mockT = jest.fn((key: string) => {
    const translations: Record<string, string> = {
      "profile.section.social_links": "Social Links",
      "profile.form.platform_label": "Platform",
      "profile.form.optional_custom_name_label": "Custom Name (Optional)",
      "general.add_more": "Add More",
    }
    return translations[key] || key
  })

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseI18n.mockReturnValue(mockT)
    mockUseGetSocialLinkOptions.mockReturnValue(mockSocialLinkOptions)
  })

  describe("Rendering", () => {
    it("should render base section with title", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <SocialLinksSection control={form.control} name="links" />
          )}
        </TestWrapper>
      )

      expect(screen.getByTestId("base-section")).toBeInTheDocument()
      expect(screen.getByTestId("section-title")).toHaveTextContent(
        "Social Links"
      )
    })

    it("should render add button when no links exist", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <SocialLinksSection control={form.control} name="links" />
          )}
        </TestWrapper>
      )

      expect(screen.getByTestId("button")).toBeInTheDocument()
      expect(screen.getByText("+ Add More")).toBeInTheDocument()
    })

    it("should not render any link fields when links array is empty", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <SocialLinksSection control={form.control} name="links" />
          )}
        </TestWrapper>
      )

      expect(screen.queryByText(/Link #/)).not.toBeInTheDocument()
    })
  })

  describe("Adding Links", () => {
    it("should add a new link field when add button is clicked", () => {
      let formInstance: any
      render(
        <TestWrapper>
          {(form: any) => {
            formInstance = form
            return <SocialLinksSection control={form.control} name="links" />
          }}
        </TestWrapper>
      )

      const addButton = screen.getByTestId("button")
      fireEvent.click(addButton)

      const links = formInstance.getValues("links")
      expect(links).toHaveLength(1)
      expect(links[0]).toEqual({
        url: "",
        type: ESocialLink.CUSTOM,
        name: "",
      })
    })

    it("should allow adding up to 5 links", () => {
      let formInstance: any
      render(
        <TestWrapper>
          {(form: any) => {
            formInstance = form
            return <SocialLinksSection control={form.control} name="links" />
          }}
        </TestWrapper>
      )

      const addButton = screen.getByTestId("button")

      // Add 5 links
      for (let i = 0; i < 5; i++) {
        fireEvent.click(addButton)
      }

      const links = formInstance.getValues("links")
      expect(links).toHaveLength(5)
    })

    it("should hide add button when 5 links exist", () => {
      render(
        <TestWrapper
          defaultValues={{
            links: [
              { url: "", type: ESocialLink.LINKEDIN, name: "" },
              { url: "", type: ESocialLink.GITHUB, name: "" },
              { url: "", type: ESocialLink.INSTAGRAM, name: "" },
              { url: "", type: ESocialLink.CUSTOM, name: "" },
              { url: "", type: ESocialLink.CUSTOM, name: "" },
            ],
          }}
        >
          {(form: any) => (
            <SocialLinksSection control={form.control} name="links" />
          )}
        </TestWrapper>
      )

      expect(screen.queryByTestId("button")).not.toBeInTheDocument()
    })
  })

  describe("Link Fields", () => {
    it("should render link fields with proper labels", () => {
      render(
        <TestWrapper
          defaultValues={{
            links: [{ url: "", type: ESocialLink.LINKEDIN, name: "" }],
          }}
        >
          {(form: any) => (
            <SocialLinksSection control={form.control} name="links" />
          )}
        </TestWrapper>
      )

      expect(screen.getByText("Link #1")).toBeInTheDocument()
      expect(screen.getByText("Platform")).toBeInTheDocument()
      expect(screen.getByText("Custom Name (Optional)")).toBeInTheDocument()
      expect(screen.getByText("Link")).toBeInTheDocument()
    })

    it("should render multiple link fields with correct numbering", () => {
      render(
        <TestWrapper
          defaultValues={{
            links: [
              { url: "", type: ESocialLink.LINKEDIN, name: "" },
              { url: "", type: ESocialLink.GITHUB, name: "" },
              { url: "", type: ESocialLink.INSTAGRAM, name: "" },
            ],
          }}
        >
          {(form: any) => (
            <SocialLinksSection control={form.control} name="links" />
          )}
        </TestWrapper>
      )

      expect(screen.getByText("Link #1")).toBeInTheDocument()
      expect(screen.getByText("Link #2")).toBeInTheDocument()
      expect(screen.getByText("Link #3")).toBeInTheDocument()
    })

    it("should render delete button for each link", () => {
      render(
        <TestWrapper
          defaultValues={{
            links: [
              { url: "", type: ESocialLink.LINKEDIN, name: "" },
              { url: "", type: ESocialLink.GITHUB, name: "" },
            ],
          }}
        >
          {(form: any) => (
            <SocialLinksSection control={form.control} name="links" />
          )}
        </TestWrapper>
      )

      const trashIcons = screen.getAllByTestId("trash-icon")
      expect(trashIcons).toHaveLength(2)
    })
  })

  describe("Removing Links", () => {
    it("should remove a link when delete button is clicked", () => {
      let formInstance: any
      const { container } = render(
        <TestWrapper
          defaultValues={{
            links: [
              {
                url: "https://linkedin.com/test",
                type: ESocialLink.LINKEDIN,
                name: "",
              },
              {
                url: "https://github.com/test",
                type: ESocialLink.GITHUB,
                name: "",
              },
            ],
          }}
        >
          {(form: any) => {
            formInstance = form
            return <SocialLinksSection control={form.control} name="links" />
          }}
        </TestWrapper>
      )

      // Find delete buttons (they are inside <button type="button">)
      const deleteButtons = container.querySelectorAll('button[type="button"]')
      // First delete button (not the "Add More" button)
      const firstDeleteButton = deleteButtons[0] as HTMLButtonElement
      fireEvent.click(firstDeleteButton)

      const links = formInstance.getValues("links")
      expect(links).toHaveLength(1)
      expect(links[0].url).toBe("https://github.com/test")
    })

    it("should renumber remaining links after deletion", () => {
      const { container, rerender } = render(
        <TestWrapper
          defaultValues={{
            links: [
              { url: "url1", type: ESocialLink.LINKEDIN, name: "" },
              { url: "url2", type: ESocialLink.GITHUB, name: "" },
              { url: "url3", type: ESocialLink.INSTAGRAM, name: "" },
            ],
          }}
        >
          {(form: any) => (
            <SocialLinksSection control={form.control} name="links" />
          )}
        </TestWrapper>
      )

      expect(screen.getByText("Link #1")).toBeInTheDocument()
      expect(screen.getByText("Link #2")).toBeInTheDocument()
      expect(screen.getByText("Link #3")).toBeInTheDocument()
    })
  })

  describe("Link Type Detection", () => {
    it("should use custom type by default when adding new link", () => {
      let formInstance: any
      render(
        <TestWrapper>
          {(form: any) => {
            formInstance = form
            return <SocialLinksSection control={form.control} name="links" />
          }}
        </TestWrapper>
      )

      const addButton = screen.getByTestId("button")
      fireEvent.click(addButton)

      const links = formInstance.getValues("links")
      expect(links[0].type).toBe(ESocialLink.CUSTOM)
    })
  })

  describe("Social Link Options", () => {
    it("should call useGetSocialLinkOptions hook", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <SocialLinksSection control={form.control} name="links" />
          )}
        </TestWrapper>
      )

      expect(mockUseGetSocialLinkOptions).toHaveBeenCalled()
    })

    it("should pass options to BaseSelect component", () => {
      render(
        <TestWrapper
          defaultValues={{
            links: [{ url: "", type: ESocialLink.LINKEDIN, name: "" }],
          }}
        >
          {(form: any) => (
            <SocialLinksSection control={form.control} name="links" />
          )}
        </TestWrapper>
      )

      expect(mockUseGetSocialLinkOptions).toHaveBeenCalled()
      // BaseSelect should be rendered with options
      expect(screen.getByTestId("base-select")).toBeInTheDocument()
    })
  })

  describe("Form Integration", () => {
    it("should integrate with react-hook-form control", () => {
      let formInstance: any
      render(
        <TestWrapper>
          {(form: any) => {
            formInstance = form
            return <SocialLinksSection control={form.control} name="links" />
          }}
        </TestWrapper>
      )

      expect(formInstance).toBeDefined()
      expect(formInstance.control).toBeDefined()
    })

    it("should use provided field name", () => {
      let formInstance: any
      render(
        <TestWrapper>
          {(form: any) => {
            formInstance = form
            return (
              <SocialLinksSection control={form.control} name="customLinks" />
            )
          }}
        </TestWrapper>
      )

      const addButton = screen.getByTestId("button")
      fireEvent.click(addButton)

      expect(formInstance.getValues("customLinks")).toBeDefined()
      expect(formInstance.getValues("customLinks")).toHaveLength(1)
    })
  })

  describe("Button Styling", () => {
    it("should apply correct styling when no links exist", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <SocialLinksSection control={form.control} name="links" />
          )}
        </TestWrapper>
      )

      const button = screen.getByTestId("button")
      expect(button).toHaveClass("border-indigo-600")
      expect(button).toHaveClass("text-indigo-600")
    })

    it("should apply mt-8 class when links exist", () => {
      render(
        <TestWrapper
          defaultValues={{
            links: [{ url: "", type: ESocialLink.LINKEDIN, name: "" }],
          }}
        >
          {(form: any) => (
            <SocialLinksSection control={form.control} name="links" />
          )}
        </TestWrapper>
      )

      const button = screen.getByTestId("button")
      expect(button).toHaveClass("mt-8")
    })
  })

  describe("Edge Cases", () => {
    it("should handle empty links array", () => {
      render(
        <TestWrapper defaultValues={{ links: [] }}>
          {(form: any) => (
            <SocialLinksSection control={form.control} name="links" />
          )}
        </TestWrapper>
      )

      expect(screen.getByTestId("button")).toBeInTheDocument()
      expect(screen.queryByText(/Link #/)).not.toBeInTheDocument()
    })

    it("should handle exactly 5 links without showing add button", () => {
      const fiveLinks = Array(5)
        .fill(null)
        .map((_, i) => ({
          url: `https://example${i}.com`,
          type: ESocialLink.CUSTOM,
          name: "",
        }))

      render(
        <TestWrapper defaultValues={{ links: fiveLinks }}>
          {(form: any) => (
            <SocialLinksSection control={form.control} name="links" />
          )}
        </TestWrapper>
      )

      expect(screen.queryByTestId("button")).not.toBeInTheDocument()
      expect(screen.getByText("Link #5")).toBeInTheDocument()
    })

    it("should handle adding and removing links in sequence", () => {
      let formInstance: any
      const { container } = render(
        <TestWrapper>
          {(form: any) => {
            formInstance = form
            return <SocialLinksSection control={form.control} name="links" />
          }}
        </TestWrapper>
      )

      // Add 3 links
      const addButton = screen.getByTestId("button")
      fireEvent.click(addButton)
      fireEvent.click(addButton)
      fireEvent.click(addButton)

      let links = formInstance.getValues("links")
      expect(links).toHaveLength(3)

      // Remove middle link
      const deleteButtons = container.querySelectorAll('button[type="button"]')
      const secondDeleteButton = deleteButtons[1] as HTMLButtonElement
      fireEvent.click(secondDeleteButton)

      links = formInstance.getValues("links")
      expect(links).toHaveLength(2)
    })
  })
})
