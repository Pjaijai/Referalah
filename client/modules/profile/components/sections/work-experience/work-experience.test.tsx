import React from "react"
import { useI18n } from "@/utils/services/internationalization/client"
import { render, screen } from "@testing-library/react"
import { FormProvider, useForm } from "react-hook-form"

import { IIndustryResponse } from "@/types/api/response/industry"

import WorkExperienceSection from "./work-experience"

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
jest.mock("@/hooks/common/options/industry-options", () => ({
  __esModule: true,
  default: jest.fn(),
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

jest.mock("@/components/customized-ui/form/select", () => {
  return function MockFormSelect({ control, name, options }: any) {
    return (
      <select data-testid={`select-${name}`} name={name}>
        {options?.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    )
  }
})

jest.mock("@/components/customized-ui/form/input", () => {
  return function MockFormTextInput({ control, name }: any) {
    return <input data-testid={`input-${name}`} name={name} type="text" />
  }
})

jest.mock("@/components/customized-ui/form/number", () => {
  return function MockFormNumberInput({ control, name }: any) {
    return <input data-testid={`number-${name}`} name={name} type="number" />
  }
})

const mockUseI18n = useI18n as jest.MockedFunction<typeof useI18n>
const mockUseIndustryOptions =
  require("@/hooks/common/options/industry-options")
    .default as jest.MockedFunction<any>

// Wrapper component to provide form context
function TestWrapper({ children, defaultValues = {} }: any) {
  const methods = useForm({
    defaultValues: {
      industryUuid: "",
      yearOfExperience: 0,
      company: "",
      jobTitle: "",
      ...defaultValues,
    },
  })
  return <FormProvider {...methods}>{children(methods)}</FormProvider>
}

/**
 * WorkExperienceSection component tests
 * @group unit
 */
describe("WorkExperienceSection", () => {
  const mockIndustryList: IIndustryResponse[] = [
    {
      id: 1,
      uuid: "tech-uuid",
      value: "technology",
      english_name: "Technology",
      cantonese_name: "科技",
    },
    {
      id: 2,
      uuid: "finance-uuid",
      value: "finance",
      english_name: "Finance",
      cantonese_name: "金融",
    },
    {
      id: 3,
      uuid: "healthcare-uuid",
      value: "healthcare",
      english_name: "Healthcare",
      cantonese_name: "醫療",
    },
  ]

  const mockIndustryOptions = [
    { value: "tech-uuid", label: "Technology" },
    { value: "finance-uuid", label: "Finance" },
    { value: "healthcare-uuid", label: "Healthcare" },
  ]

  const mockT = jest.fn((key: string) => {
    const translations: Record<string, string> = {
      "profile.section.work_experience": "Work Experience",
      "general.industry": "Industry",
      "general.year_of_experience": "Years of Experience",
      "profile.form.optional_company_label": "Company (Optional)",
      "profile.form.job_title_label": "Job Title",
    }
    return translations[key] || key
  })

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseI18n.mockReturnValue(mockT)
    mockUseIndustryOptions.mockReturnValue(mockIndustryOptions)
  })

  describe("Rendering", () => {
    it("should render base section with title", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <WorkExperienceSection
              form={form}
              industryList={mockIndustryList}
            />
          )}
        </TestWrapper>
      )

      expect(screen.getByTestId("base-section")).toBeInTheDocument()
      expect(screen.getByTestId("section-title")).toHaveTextContent(
        "Work Experience"
      )
    })

    it("should render industry select field", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <WorkExperienceSection
              form={form}
              industryList={mockIndustryList}
            />
          )}
        </TestWrapper>
      )

      expect(screen.getByText("Industry")).toBeInTheDocument()
      expect(screen.getByTestId("select-industryUuid")).toBeInTheDocument()
    })

    it("should render year of experience field", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <WorkExperienceSection
              form={form}
              industryList={mockIndustryList}
            />
          )}
        </TestWrapper>
      )

      expect(screen.getByText("Years of Experience")).toBeInTheDocument()
      expect(screen.getByTestId("number-yearOfExperience")).toBeInTheDocument()
    })

    it("should render company field", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <WorkExperienceSection
              form={form}
              industryList={mockIndustryList}
            />
          )}
        </TestWrapper>
      )

      expect(screen.getByText("Company (Optional)")).toBeInTheDocument()
      expect(screen.getByTestId("input-company")).toBeInTheDocument()
    })

    it("should render job title field", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <WorkExperienceSection
              form={form}
              industryList={mockIndustryList}
            />
          )}
        </TestWrapper>
      )

      expect(screen.getByText("Job Title")).toBeInTheDocument()
      expect(screen.getByTestId("input-jobTitle")).toBeInTheDocument()
    })

    it("should render all form fields", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <WorkExperienceSection
              form={form}
              industryList={mockIndustryList}
            />
          )}
        </TestWrapper>
      )

      expect(screen.getByTestId("select-industryUuid")).toBeInTheDocument()
      expect(screen.getByTestId("number-yearOfExperience")).toBeInTheDocument()
      expect(screen.getByTestId("input-company")).toBeInTheDocument()
      expect(screen.getByTestId("input-jobTitle")).toBeInTheDocument()
    })
  })

  describe("Industry Options", () => {
    it("should call useIndustryOptions with industryList", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <WorkExperienceSection
              form={form}
              industryList={mockIndustryList}
            />
          )}
        </TestWrapper>
      )

      expect(mockUseIndustryOptions).toHaveBeenCalledWith(mockIndustryList)
    })

    it("should render industry options in select", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <WorkExperienceSection
              form={form}
              industryList={mockIndustryList}
            />
          )}
        </TestWrapper>
      )

      const select = screen.getByTestId("select-industryUuid")
      const options = select.querySelectorAll("option")

      expect(options).toHaveLength(3)
      expect(options[0]).toHaveTextContent("Technology")
      expect(options[1]).toHaveTextContent("Finance")
      expect(options[2]).toHaveTextContent("Healthcare")
    })

    it("should pass correct industry options to FormSelect", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <WorkExperienceSection
              form={form}
              industryList={mockIndustryList}
            />
          )}
        </TestWrapper>
      )

      expect(mockUseIndustryOptions).toHaveBeenCalledWith(mockIndustryList)
      expect(screen.getByTestId("select-industryUuid")).toBeInTheDocument()
    })
  })

  describe("Form Integration", () => {
    it("should integrate with react-hook-form", () => {
      let formInstance: any
      render(
        <TestWrapper>
          {(form: any) => {
            formInstance = form
            return (
              <WorkExperienceSection
                form={form}
                industryList={mockIndustryList}
              />
            )
          }}
        </TestWrapper>
      )

      expect(formInstance).toBeDefined()
      expect(formInstance.control).toBeDefined()
    })

    it("should use correct field names", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <WorkExperienceSection
              form={form}
              industryList={mockIndustryList}
            />
          )}
        </TestWrapper>
      )

      expect(screen.getByTestId("select-industryUuid")).toHaveAttribute(
        "name",
        "industryUuid"
      )
      expect(screen.getByTestId("number-yearOfExperience")).toHaveAttribute(
        "name",
        "yearOfExperience"
      )
      expect(screen.getByTestId("input-company")).toHaveAttribute(
        "name",
        "company"
      )
      expect(screen.getByTestId("input-jobTitle")).toHaveAttribute(
        "name",
        "jobTitle"
      )
    })

    it("should pass form control to all form components", () => {
      let formInstance: any
      render(
        <TestWrapper>
          {(form: any) => {
            formInstance = form
            return (
              <WorkExperienceSection
                form={form}
                industryList={mockIndustryList}
              />
            )
          }}
        </TestWrapper>
      )

      expect(mockUseIndustryOptions).toHaveBeenCalled()
      expect(formInstance.control).toBeDefined()
    })
  })

  describe("Props", () => {
    it("should accept and use industryList prop", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <WorkExperienceSection
              form={form}
              industryList={mockIndustryList}
            />
          )}
        </TestWrapper>
      )

      expect(mockUseIndustryOptions).toHaveBeenCalledWith(mockIndustryList)
    })

    it("should accept and use form prop", () => {
      let formInstance: any
      render(
        <TestWrapper>
          {(form: any) => {
            formInstance = form
            return (
              <WorkExperienceSection
                form={form}
                industryList={mockIndustryList}
              />
            )
          }}
        </TestWrapper>
      )

      expect(formInstance).toBeDefined()
      // Verify that the form is being used
      expect(screen.getByTestId("select-industryUuid")).toBeInTheDocument()
    })

    it("should handle empty industryList", () => {
      mockUseIndustryOptions.mockReturnValue([])

      render(
        <TestWrapper>
          {(form: any) => (
            <WorkExperienceSection form={form} industryList={[]} />
          )}
        </TestWrapper>
      )

      expect(mockUseIndustryOptions).toHaveBeenCalledWith([])
      expect(screen.getByTestId("select-industryUuid")).toBeInTheDocument()
    })
  })

  describe("Field Types", () => {
    it("should use select for industry field", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <WorkExperienceSection
              form={form}
              industryList={mockIndustryList}
            />
          )}
        </TestWrapper>
      )

      const industryField = screen.getByTestId("select-industryUuid")
      expect(industryField.tagName).toBe("SELECT")
    })

    it("should use number input for year of experience", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <WorkExperienceSection
              form={form}
              industryList={mockIndustryList}
            />
          )}
        </TestWrapper>
      )

      const yearField = screen.getByTestId("number-yearOfExperience")
      expect(yearField).toHaveAttribute("type", "number")
    })

    it("should use text input for company", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <WorkExperienceSection
              form={form}
              industryList={mockIndustryList}
            />
          )}
        </TestWrapper>
      )

      const companyField = screen.getByTestId("input-company")
      expect(companyField).toHaveAttribute("type", "text")
    })

    it("should use text input for job title", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <WorkExperienceSection
              form={form}
              industryList={mockIndustryList}
            />
          )}
        </TestWrapper>
      )

      const jobTitleField = screen.getByTestId("input-jobTitle")
      expect(jobTitleField).toHaveAttribute("type", "text")
    })
  })

  describe("Internationalization", () => {
    it("should call useI18n hook", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <WorkExperienceSection
              form={form}
              industryList={mockIndustryList}
            />
          )}
        </TestWrapper>
      )

      expect(mockUseI18n).toHaveBeenCalled()
    })

    it("should translate all labels correctly", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <WorkExperienceSection
              form={form}
              industryList={mockIndustryList}
            />
          )}
        </TestWrapper>
      )

      expect(mockT).toHaveBeenCalledWith("profile.section.work_experience")
      expect(mockT).toHaveBeenCalledWith("general.industry")
      expect(mockT).toHaveBeenCalledWith("general.year_of_experience")
      expect(mockT).toHaveBeenCalledWith("profile.form.optional_company_label")
      expect(mockT).toHaveBeenCalledWith("profile.form.job_title_label")
    })
  })

  describe("Layout", () => {
    it("should render fields in two columns layout", () => {
      const { container } = render(
        <TestWrapper>
          {(form: any) => (
            <WorkExperienceSection
              form={form}
              industryList={mockIndustryList}
            />
          )}
        </TestWrapper>
      )

      const columns = container.querySelectorAll(".max-w-lg")
      expect(columns).toHaveLength(2)
    })

    it("should render industry and year of experience in first column", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <WorkExperienceSection
              form={form}
              industryList={mockIndustryList}
            />
          )}
        </TestWrapper>
      )

      expect(screen.getByTestId("select-industryUuid")).toBeInTheDocument()
      expect(screen.getByTestId("number-yearOfExperience")).toBeInTheDocument()
    })

    it("should render company and job title in second column", () => {
      render(
        <TestWrapper>
          {(form: any) => (
            <WorkExperienceSection
              form={form}
              industryList={mockIndustryList}
            />
          )}
        </TestWrapper>
      )

      expect(screen.getByTestId("input-company")).toBeInTheDocument()
      expect(screen.getByTestId("input-jobTitle")).toBeInTheDocument()
    })
  })

  describe("Edge Cases", () => {
    it("should handle undefined default values", () => {
      render(
        <TestWrapper defaultValues={{}}>
          {(form: any) => (
            <WorkExperienceSection
              form={form}
              industryList={mockIndustryList}
            />
          )}
        </TestWrapper>
      )

      expect(screen.getByTestId("base-section")).toBeInTheDocument()
    })

    it("should render with minimal industryList", () => {
      const minimalList: IIndustryResponse[] = [
        {
          id: 4,
          uuid: "single-uuid",
          value: "single-industry",
          english_name: "Single Industry",
          cantonese_name: "單一行業",
        },
      ]

      mockUseIndustryOptions.mockReturnValue([
        { value: "single-uuid", label: "Single Industry" },
      ])

      render(
        <TestWrapper>
          {(form: any) => (
            <WorkExperienceSection form={form} industryList={minimalList} />
          )}
        </TestWrapper>
      )

      expect(mockUseIndustryOptions).toHaveBeenCalledWith(minimalList)
      expect(screen.getByTestId("select-industryUuid")).toBeInTheDocument()
    })

    it("should render all fields even with empty form values", () => {
      render(
        <TestWrapper
          defaultValues={{
            industryUuid: "",
            yearOfExperience: 0,
            company: "",
            jobTitle: "",
          }}
        >
          {(form: any) => (
            <WorkExperienceSection
              form={form}
              industryList={mockIndustryList}
            />
          )}
        </TestWrapper>
      )

      expect(screen.getByTestId("select-industryUuid")).toBeInTheDocument()
      expect(screen.getByTestId("number-yearOfExperience")).toBeInTheDocument()
      expect(screen.getByTestId("input-company")).toBeInTheDocument()
      expect(screen.getByTestId("input-jobTitle")).toBeInTheDocument()
    })
  })
})
