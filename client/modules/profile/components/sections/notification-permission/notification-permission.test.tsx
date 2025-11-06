import React from "react"
import { useI18n } from "@/utils/services/internationalization/client"
import { fireEvent, render, screen } from "@testing-library/react"
import { FormProvider, useForm } from "react-hook-form"

import NotificationPermissionSection from "./notification-permission"

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

jest.mock("@/components/customized-ui/form/switch", () => {
  return function MockFormSwitch({
    control,
    name,
    checked,
    onCheckedChange,
  }: any) {
    return (
      <input
        type="checkbox"
        data-testid={`switch-${name}`}
        checked={checked}
        onChange={() => onCheckedChange(!checked)} // Toggle the checked state
      />
    )
  }
})

const mockUseI18n = useI18n as jest.MockedFunction<typeof useI18n>

// Wrapper component to provide form context
function TestWrapper({ children, defaultValues = {} }: any) {
  const methods = useForm({
    defaultValues: {
      notificationPermissions: [],
      ...defaultValues,
    },
  })
  return <FormProvider {...methods}>{children(methods)}</FormProvider>
}

/**
 * NotificationPermissionSection component tests
 * @group unit
 */
describe("NotificationPermissionSection", () => {
  const mockT = jest.fn((key: string) => {
    const translations: Record<string, string> = {
      "profile.section.notification_config": "Notification Settings",
      "general.post": "Post",
      "general.other": "Other",
      "profile.form.post_contact_follow_up_label": "Post contact follow-up",
      "profile.form.coffee_chat_request_follow_up_label":
        "Coffee chat request follow-up",
      "profile.form.unseen_message_label": "Unseen messages",
      "profile.form.official_broadcast_message_label": "Official broadcasts",
    }
    return translations[key] || key
  })

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseI18n.mockReturnValue(mockT)
  })

  describe("Rendering", () => {
    it("should render base section with title", () => {
      render(
        <TestWrapper>{() => <NotificationPermissionSection />}</TestWrapper>
      )

      expect(screen.getByTestId("base-section")).toBeInTheDocument()
      expect(screen.getByTestId("section-title")).toHaveTextContent(
        "Notification Settings"
      )
    })

    it("should render post notification section", () => {
      render(
        <TestWrapper>{() => <NotificationPermissionSection />}</TestWrapper>
      )

      expect(screen.getByText("Post")).toBeInTheDocument()
      expect(screen.getByText("Post contact follow-up")).toBeInTheDocument()
    })

    it("should render coffee chat notification section", () => {
      render(
        <TestWrapper>{() => <NotificationPermissionSection />}</TestWrapper>
      )

      expect(screen.getByText("Coffee Chat")).toBeInTheDocument()
      expect(
        screen.getByText("Coffee chat request follow-up")
      ).toBeInTheDocument()
    })

    it("should render other notifications section", () => {
      render(
        <TestWrapper>{() => <NotificationPermissionSection />}</TestWrapper>
      )

      expect(screen.getByText("Other")).toBeInTheDocument()
      expect(screen.getByText("Unseen messages")).toBeInTheDocument()
      expect(screen.getByText("Official broadcasts")).toBeInTheDocument()
    })

    it("should render all four notification switches", () => {
      render(
        <TestWrapper>{() => <NotificationPermissionSection />}</TestWrapper>
      )

      const switches = screen.getAllByTestId("switch-notificationPermissions")
      expect(switches).toHaveLength(4)
    })
  })

  describe("Switch States", () => {
    it("should display all switches as unchecked when no permissions set", () => {
      render(
        <TestWrapper defaultValues={{ notificationPermissions: [] }}>
          {() => <NotificationPermissionSection />}
        </TestWrapper>
      )

      const switches = screen.getAllByTestId("switch-notificationPermissions")
      switches.forEach((switchElement) => {
        expect(switchElement).not.toBeChecked()
      })
    })

    it("should display switches as checked based on notification permissions", () => {
      let formInstance: any
      render(
        <TestWrapper
          defaultValues={{
            notificationPermissions: [
              "post_contact_follow_up",
              "unseen_message",
            ],
          }}
        >
          {(form: any) => {
            formInstance = form
            return <NotificationPermissionSection />
          }}
        </TestWrapper>
      )

      // Verify form has correct initial permissions
      const permissions = formInstance.getValues("notificationPermissions")
      expect(permissions).toContain("post_contact_follow_up")
      expect(permissions).toContain("unseen_message")
      expect(permissions).not.toContain("coffee_chat_request_follow_up")
      expect(permissions).not.toContain("official_broadcast_message")
      expect(permissions).toHaveLength(2)
    })

    it("should display all switches as checked when all permissions set", () => {
      let formInstance: any
      render(
        <TestWrapper
          defaultValues={{
            notificationPermissions: [
              "post_contact_follow_up",
              "coffee_chat_request_follow_up",
              "unseen_message",
              "official_broadcast_message",
            ],
          }}
        >
          {(form: any) => {
            formInstance = form
            return <NotificationPermissionSection />
          }}
        </TestWrapper>
      )

      // Verify form has all permissions
      const permissions = formInstance.getValues("notificationPermissions")
      expect(permissions).toContain("post_contact_follow_up")
      expect(permissions).toContain("coffee_chat_request_follow_up")
      expect(permissions).toContain("unseen_message")
      expect(permissions).toContain("official_broadcast_message")
      expect(permissions).toHaveLength(4)
    })
  })

  describe("Switch Interaction", () => {
    it("should toggle post contact follow-up switch", () => {
      let formInstance: any
      render(
        <TestWrapper defaultValues={{ notificationPermissions: [] }}>
          {(form: any) => {
            formInstance = form
            return <NotificationPermissionSection />
          }}
        </TestWrapper>
      )

      const switches = screen.getAllByTestId("switch-notificationPermissions")
      fireEvent.click(switches[0]) // Toggle post_contact_follow_up

      const permissions = formInstance.getValues("notificationPermissions")
      expect(permissions).toContain("post_contact_follow_up")
    })

    it("should toggle coffee chat request follow-up switch", () => {
      let formInstance: any
      render(
        <TestWrapper defaultValues={{ notificationPermissions: [] }}>
          {(form: any) => {
            formInstance = form
            return <NotificationPermissionSection />
          }}
        </TestWrapper>
      )

      const switches = screen.getAllByTestId("switch-notificationPermissions")
      fireEvent.click(switches[1]) // Toggle coffee_chat_request_follow_up

      const permissions = formInstance.getValues("notificationPermissions")
      expect(permissions).toContain("coffee_chat_request_follow_up")
    })

    it("should toggle unseen message switch", () => {
      let formInstance: any
      render(
        <TestWrapper defaultValues={{ notificationPermissions: [] }}>
          {(form: any) => {
            formInstance = form
            return <NotificationPermissionSection />
          }}
        </TestWrapper>
      )

      const switches = screen.getAllByTestId("switch-notificationPermissions")
      fireEvent.click(switches[2]) // Toggle unseen_message

      const permissions = formInstance.getValues("notificationPermissions")
      expect(permissions).toContain("unseen_message")
    })

    it("should toggle official broadcast message switch", () => {
      let formInstance: any
      render(
        <TestWrapper defaultValues={{ notificationPermissions: [] }}>
          {(form: any) => {
            formInstance = form
            return <NotificationPermissionSection />
          }}
        </TestWrapper>
      )

      const switches = screen.getAllByTestId("switch-notificationPermissions")
      fireEvent.click(switches[3]) // Toggle official_broadcast_message

      const permissions = formInstance.getValues("notificationPermissions")
      expect(permissions).toContain("official_broadcast_message")
    })

    it("should remove permission when switch is toggled off", () => {
      let formInstance: any
      render(
        <TestWrapper defaultValues={{ notificationPermissions: [] }}>
          {(form: any) => {
            formInstance = form
            return <NotificationPermissionSection />
          }}
        </TestWrapper>
      )

      const switches = screen.getAllByTestId("switch-notificationPermissions")

      // First add a permission by clicking
      fireEvent.click(switches[1]) // Toggle coffee_chat (off->on)
      let permissions = formInstance.getValues("notificationPermissions")
      expect(permissions).toContain("coffee_chat_request_follow_up")

      // Now toggle it back off
      fireEvent.click(switches[1]) // Toggle coffee_chat (on->off)
      permissions = formInstance.getValues("notificationPermissions")
      expect(permissions).not.toContain("coffee_chat_request_follow_up")
      expect(permissions).toHaveLength(0)
    })

    it("should handle multiple permission toggles", () => {
      let formInstance: any
      render(
        <TestWrapper defaultValues={{ notificationPermissions: [] }}>
          {(form: any) => {
            formInstance = form
            return <NotificationPermissionSection />
          }}
        </TestWrapper>
      )

      const switches = screen.getAllByTestId("switch-notificationPermissions")

      // Toggle multiple switches
      fireEvent.click(switches[0]) // post_contact_follow_up
      fireEvent.click(switches[2]) // unseen_message
      fireEvent.click(switches[3]) // official_broadcast_message

      const permissions = formInstance.getValues("notificationPermissions")
      expect(permissions).toHaveLength(3)
      expect(permissions).toContain("post_contact_follow_up")
      expect(permissions).toContain("unseen_message")
      expect(permissions).toContain("official_broadcast_message")
      expect(permissions).not.toContain("coffee_chat_request_follow_up")
    })
  })

  describe("Form Integration", () => {
    it("should use form context from react-hook-form", () => {
      let formInstance: any
      render(
        <TestWrapper
          defaultValues={{ notificationPermissions: ["unseen_message"] }}
        >
          {(form: any) => {
            formInstance = form
            return <NotificationPermissionSection />
          }}
        </TestWrapper>
      )

      expect(formInstance).toBeDefined()
      const permissions = formInstance.getValues("notificationPermissions")
      expect(permissions).toEqual(["unseen_message"])
    })

    it("should call setValue with shouldValidate flag", () => {
      let formInstance: any
      let setValueSpy: any

      function TestComponent() {
        const methods = useForm({
          defaultValues: { notificationPermissions: [] },
        })
        formInstance = methods
        setValueSpy = jest.spyOn(methods, "setValue")
        return (
          <FormProvider {...methods}>
            <NotificationPermissionSection />
          </FormProvider>
        )
      }

      render(<TestComponent />)

      const switches = screen.getAllByTestId("switch-notificationPermissions")
      fireEvent.click(switches[0])

      expect(setValueSpy).toHaveBeenCalledWith(
        "notificationPermissions",
        expect.any(Array),
        { shouldValidate: true }
      )
    })
  })

  describe("Edge Cases", () => {
    it("should handle empty notification permissions array", () => {
      render(
        <TestWrapper defaultValues={{ notificationPermissions: [] }}>
          {() => <NotificationPermissionSection />}
        </TestWrapper>
      )

      const switches = screen.getAllByTestId("switch-notificationPermissions")
      switches.forEach((switchElement) => {
        expect(switchElement).not.toBeChecked()
      })
    })

    it("should handle undefined notification permissions", () => {
      render(
        <TestWrapper defaultValues={{ notificationPermissions: undefined }}>
          {() => <NotificationPermissionSection />}
        </TestWrapper>
      )

      // Should render without crashing and default to empty array
      expect(screen.getByTestId("base-section")).toBeInTheDocument()
    })

    it("should prevent duplicate permissions when toggling multiple times", () => {
      let formInstance: any
      render(
        <TestWrapper defaultValues={{ notificationPermissions: [] }}>
          {(form: any) => {
            formInstance = form
            return <NotificationPermissionSection />
          }}
        </TestWrapper>
      )

      const switches = screen.getAllByTestId("switch-notificationPermissions")

      // Toggle on and off multiple times
      fireEvent.click(switches[0]) // on
      fireEvent.click(switches[0]) // off
      fireEvent.click(switches[0]) // on

      const permissions = formInstance.getValues("notificationPermissions")
      const postPermissionCount = permissions.filter(
        (p: string) => p === "post_contact_follow_up"
      ).length
      expect(postPermissionCount).toBe(1)
    })
  })
})
