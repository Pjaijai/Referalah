import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"

import "@testing-library/jest-dom"
import { EReferralType } from "@/types/common/referral-type"
import { ESocialLink } from "@/types/common/social-links"

import MemberCard from "./member"

// Mock Next.js router
const mockPush = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock internationalization
jest.mock("@/utils/services/internationalization/client", () => ({
  useI18n: () => (key: string) => key,
}))

// Mock child components
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, className }: any) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ),
}))

jest.mock("@/components/ui/card", () => ({
  Card: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
}))

jest.mock("@/components/customized-ui/avatars/base", () => ({
  __esModule: true,
  default: ({ fallBack, alt }: any) => (
    <div data-testid="base-avatar" aria-label={alt}>
      {fallBack}
    </div>
  ),
}))

jest.mock("@/components/customized-ui/badges/linkedin/linkedin", () => ({
  __esModule: true,
  default: ({ name, picture, variant }: any) => (
    <div data-testid="linkedin-badge" data-variant={variant}>
      LinkedIn: {name || "Verified"} - {variant}
    </div>
  ),
}))

jest.mock("@/components/customized-ui/badges/referee/referee", () => ({
  __esModule: true,
  default: () => <div data-testid="referee-badge">Referee</div>,
}))

jest.mock("@/components/customized-ui/badges/referrer/referrer", () => ({
  __esModule: true,
  default: () => <div data-testid="referrer-badge">Referrer</div>,
}))

jest.mock("@/components/customized-ui/buttons/contact", () => ({
  __esModule: true,
  default: ({ username, toUuid }: any) => (
    <button data-testid="contact-button">
      Contact {username} ({toUuid})
    </button>
  ),
}))

jest.mock("@/components/customized-ui/icons/contact-request-count", () => ({
  __esModule: true,
  default: ({ count, status }: any) => (
    <div data-testid="contact-request-count">
      {count} ({status})
    </div>
  ),
}))

jest.mock("@/components/customized-ui/icons/social-icon-with-tooltip", () => ({
  __esModule: true,
  default: ({ type, url, name }: any) => (
    <a data-testid={`social-icon-${type}`} href={url}>
      {name}
    </a>
  ),
}))

/**
 * MemberCard component tests
 * @group unit
 */
describe("MemberCard Component", () => {
  const defaultProps = {
    uuid: "user-123",
    username: "johndoe",
    photoUrl: "https://example.com/photo.jpg",
    description: "Software engineer with 5 years of experience",
    companyName: "Tech Corp",
    jobTitle: "Senior Developer",
    yearOfExperience: 5,
    location: "Hong Kong",
    industry: "Technology",
    socialMediaUrl: null,
    receiverType: EReferralType.REFERRER,
    isReferrer: true,
    isReferee: false,
    requestCount: 3,
    links: [
      {
        type: ESocialLink.GITHUB,
        url: "https://github.com/johndoe",
        name: "johndoe",
      },
    ],
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("Basic Rendering", () => {
    it("should render the member card with basic information", () => {
      render(<MemberCard {...defaultProps} />)

      expect(screen.getByText("@johndoe")).toBeInTheDocument()
      expect(screen.getByText("Senior Developer")).toBeInTheDocument()
      expect(screen.getByText(/@ Tech Corp/)).toBeInTheDocument()
      expect(
        screen.getByText("Software engineer with 5 years of experience")
      ).toBeInTheDocument()
    })

    it("should render avatar with username fallback", () => {
      render(<MemberCard {...defaultProps} />)

      const avatar = screen.getByTestId("base-avatar")
      expect(avatar).toHaveTextContent("j")
    })

    it("should render location, experience, and industry", () => {
      render(<MemberCard {...defaultProps} />)

      expect(screen.getByText("Hong Kong")).toBeInTheDocument()
      expect(screen.getByText("5 YOE")).toBeInTheDocument()
      expect(screen.getByText("Technology")).toBeInTheDocument()
    })

    it("should render contact request count", () => {
      render(<MemberCard {...defaultProps} />)

      expect(screen.getByTestId("contact-request-count")).toHaveTextContent(
        "3 (active)"
      )
    })

    it("should render social links", () => {
      render(<MemberCard {...defaultProps} />)

      const socialLink = screen.getByTestId(`social-icon-${ESocialLink.GITHUB}`)
      expect(socialLink).toBeInTheDocument()
      expect(socialLink).toHaveAttribute("href", "https://github.com/johndoe")
    })
  })

  describe("LinkedIn Verification Badge", () => {
    it("should render LinkedIn badge when linkedInVerification is provided", () => {
      const propsWithLinkedIn = {
        ...defaultProps,
        linkedInVerification: {
          user_uuid: "user-123",
          name: "John Doe",
          picture: "https://linkedin.com/photo.jpg",
        },
      }

      render(<MemberCard {...propsWithLinkedIn} />)

      const linkedInBadge = screen.getByTestId("linkedin-badge")
      expect(linkedInBadge).toBeInTheDocument()
      expect(linkedInBadge).toHaveTextContent("LinkedIn: John Doe")
    })

    it("should use simple variant for LinkedIn badge", () => {
      const propsWithLinkedIn = {
        ...defaultProps,
        linkedInVerification: {
          user_uuid: "user-123",
          name: "John Doe",
          picture: "https://linkedin.com/photo.jpg",
        },
      }

      render(<MemberCard {...propsWithLinkedIn} />)

      const linkedInBadge = screen.getByTestId("linkedin-badge")
      expect(linkedInBadge).toHaveAttribute("data-variant", "simple")
    })

    it("should not render LinkedIn badge when linkedInVerification is null", () => {
      const propsWithoutLinkedIn = {
        ...defaultProps,
        linkedInVerification: null,
      }

      render(<MemberCard {...propsWithoutLinkedIn} />)

      expect(screen.queryByTestId("linkedin-badge")).not.toBeInTheDocument()
    })

    it("should not render LinkedIn badge when linkedInVerification is undefined", () => {
      render(<MemberCard {...defaultProps} />)

      expect(screen.queryByTestId("linkedin-badge")).not.toBeInTheDocument()
    })

    it("should handle LinkedIn verification with null name", () => {
      const propsWithLinkedIn = {
        ...defaultProps,
        linkedInVerification: {
          user_uuid: "user-123",
          name: null,
          picture: "https://linkedin.com/photo.jpg",
        },
      }

      render(<MemberCard {...propsWithLinkedIn} />)

      const linkedInBadge = screen.getByTestId("linkedin-badge")
      expect(linkedInBadge).toBeInTheDocument()
      expect(linkedInBadge).toHaveTextContent("Verified")
    })

    it("should handle LinkedIn verification with null picture", () => {
      const propsWithLinkedIn = {
        ...defaultProps,
        linkedInVerification: {
          user_uuid: "user-123",
          name: "John Doe",
          picture: null,
        },
      }

      render(<MemberCard {...propsWithLinkedIn} />)

      const linkedInBadge = screen.getByTestId("linkedin-badge")
      expect(linkedInBadge).toBeInTheDocument()
    })
  })

  describe("Referee and Referrer Badges", () => {
    it("should render referrer badge when isReferrer is true", () => {
      render(<MemberCard {...defaultProps} isReferrer={true} />)

      expect(screen.getByTestId("referrer-badge")).toBeInTheDocument()
    })

    it("should render referee badge when isReferee is true", () => {
      render(<MemberCard {...defaultProps} isReferee={true} />)

      expect(screen.getByTestId("referee-badge")).toBeInTheDocument()
    })

    it("should render both badges when user is both referee and referrer", () => {
      render(
        <MemberCard {...defaultProps} isReferrer={true} isReferee={true} />
      )

      expect(screen.getByTestId("referrer-badge")).toBeInTheDocument()
      expect(screen.getByTestId("referee-badge")).toBeInTheDocument()
    })

    it("should not render badges when user is neither referee nor referrer", () => {
      render(
        <MemberCard {...defaultProps} isReferrer={false} isReferee={false} />
      )

      expect(screen.queryByTestId("referrer-badge")).not.toBeInTheDocument()
      expect(screen.queryByTestId("referee-badge")).not.toBeInTheDocument()
    })

    it("should render LinkedIn badge alongside referee and referrer badges", () => {
      const propsWithAll = {
        ...defaultProps,
        isReferrer: true,
        isReferee: true,
        linkedInVerification: {
          user_uuid: "user-123",
          name: "John Doe",
          picture: "https://linkedin.com/photo.jpg",
        },
      }

      render(<MemberCard {...propsWithAll} />)

      expect(screen.getByTestId("linkedin-badge")).toBeInTheDocument()
      expect(screen.getByTestId("referrer-badge")).toBeInTheDocument()
      expect(screen.getByTestId("referee-badge")).toBeInTheDocument()
    })
  })

  describe("Professional Information", () => {
    it("should display job title and company", () => {
      render(<MemberCard {...defaultProps} />)

      expect(screen.getByText("Senior Developer")).toBeInTheDocument()
      expect(screen.getByText(/@ Tech Corp/)).toBeInTheDocument()
    })

    it("should display job title without company when company is null", () => {
      const propsWithoutCompany = {
        ...defaultProps,
        companyName: null,
      }

      render(<MemberCard {...propsWithoutCompany} />)

      expect(screen.getByText("Senior Developer")).toBeInTheDocument()
      expect(screen.queryByText(/@ Tech Corp/)).not.toBeInTheDocument()
    })

    it("should handle null job title", () => {
      const propsWithoutJobTitle = {
        ...defaultProps,
        jobTitle: null,
      }

      render(<MemberCard {...propsWithoutJobTitle} />)

      expect(screen.getByText(/@ Tech Corp/)).toBeInTheDocument()
    })

    it("should format years of experience", () => {
      render(<MemberCard {...defaultProps} yearOfExperience={10} />)

      expect(screen.getByText("10 YOE")).toBeInTheDocument()
    })

    it("should not display YOE when yearOfExperience is null", () => {
      const propsWithoutExperience = {
        ...defaultProps,
        yearOfExperience: null,
      }

      render(<MemberCard {...propsWithoutExperience} />)

      expect(screen.queryByText(/YOE/)).not.toBeInTheDocument()
    })

    it("should handle 0 years of experience", () => {
      render(<MemberCard {...defaultProps} yearOfExperience={0} />)

      expect(screen.queryByText("0 YOE")).not.toBeInTheDocument()
    })
  })

  describe("Contact Request Count", () => {
    it("should show active status when count is greater than 0", () => {
      render(<MemberCard {...defaultProps} requestCount={5} />)

      expect(screen.getByTestId("contact-request-count")).toHaveTextContent(
        "5 (active)"
      )
    })

    it("should show inactive status when count is 0", () => {
      render(<MemberCard {...defaultProps} requestCount={0} />)

      expect(screen.getByTestId("contact-request-count")).toHaveTextContent(
        "0 (inactive)"
      )
    })
  })

  describe("Action Buttons", () => {
    it("should render check profile button", () => {
      render(<MemberCard {...defaultProps} />)

      expect(screen.getByText("general.check_user_profile")).toBeInTheDocument()
    })

    it("should navigate to profile page when check profile is clicked", () => {
      render(<MemberCard {...defaultProps} />)

      const button = screen.getByText("general.check_user_profile")
      fireEvent.click(button)

      expect(mockPush).toHaveBeenCalledWith("/profile/user-123")
    })

    it("should render contact button with correct props", () => {
      render(<MemberCard {...defaultProps} />)

      const contactButton = screen.getByTestId("contact-button")
      expect(contactButton).toHaveTextContent("Contact johndoe (user-123)")
    })
  })

  describe("Social Links", () => {
    it("should render multiple social links", () => {
      const propsWithMultipleLinks = {
        ...defaultProps,
        links: [
          {
            type: ESocialLink.GITHUB,
            url: "https://github.com/johndoe",
            name: "johndoe",
          },
          {
            type: ESocialLink.LINKEDIN,
            url: "https://linkedin.com/in/johndoe",
            name: "johndoe",
          },
        ],
      }

      render(<MemberCard {...propsWithMultipleLinks} />)

      expect(
        screen.getByTestId(`social-icon-${ESocialLink.GITHUB}`)
      ).toBeInTheDocument()
      expect(
        screen.getByTestId(`social-icon-${ESocialLink.LINKEDIN}`)
      ).toBeInTheDocument()
    })

    it("should handle empty links array", () => {
      const propsWithNoLinks = {
        ...defaultProps,
        links: [],
      }

      render(<MemberCard {...propsWithNoLinks} />)

      expect(screen.queryByTestId(/social-icon-/)).not.toBeInTheDocument()
    })
  })

  describe("Null Handling", () => {
    it("should handle null username", () => {
      const propsWithNullUsername = {
        ...defaultProps,
        username: null,
      }

      render(<MemberCard {...propsWithNullUsername} />)

      expect(screen.getByText("@")).toBeInTheDocument()
      const avatar = screen.getByTestId("base-avatar")
      expect(avatar).toHaveTextContent("?")
    })

    it("should handle null description", () => {
      const propsWithNullDescription = {
        ...defaultProps,
        description: null,
      }

      const { container } = render(<MemberCard {...propsWithNullDescription} />)

      // Description paragraph should be empty
      const descriptionElement = container.querySelector(".line-clamp-2")
      expect(descriptionElement).toBeEmptyDOMElement()
    })

    it("should handle null uuid", () => {
      const propsWithNullUuid = {
        ...defaultProps,
        uuid: null,
      }

      render(<MemberCard {...propsWithNullUuid} />)

      const button = screen.getByText("general.check_user_profile")
      fireEvent.click(button)

      expect(mockPush).toHaveBeenCalledWith("/profile/null")
    })
  })

  describe("Edge Cases", () => {
    it("should handle very long description", () => {
      const propsWithLongDescription = {
        ...defaultProps,
        description: "A".repeat(500),
      }

      render(<MemberCard {...propsWithLongDescription} />)

      expect(screen.getByText("A".repeat(500))).toBeInTheDocument()
    })

    it("should handle special characters in username", () => {
      const propsWithSpecialChars = {
        ...defaultProps,
        username: "john.doe-123",
      }

      render(<MemberCard {...propsWithSpecialChars} />)

      expect(screen.getByText("@john.doe-123")).toBeInTheDocument()
    })

    it("should handle very high request count", () => {
      render(<MemberCard {...defaultProps} requestCount={999} />)

      expect(screen.getByTestId("contact-request-count")).toHaveTextContent(
        "999 (active)"
      )
    })
  })
})
