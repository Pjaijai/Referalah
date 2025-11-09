import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"

import "@testing-library/jest-dom"
import { IIndustryResponse } from "@/types/api/response/industry"
import { TLocationData } from "@/types/api/response/location"
import { EMessageType } from "@/types/common/message-type"

import SearchBar from "./search"

// Mock the internationalization hooks
jest.mock("@/utils/services/internationalization/client", () => ({
  useI18n: () => (key: string) => key,
  useCurrentLocale: () => "en",
}))

// Mock the custom hooks
jest.mock("@/hooks/common/options/location-options-list", () => ({
  __esModule: true,
  default: jest.fn(() => [
    { label: "All Locations", value: "all" },
    { label: "Hong Kong", value: "hk-uuid" },
    { label: "Singapore", value: "sg-uuid" },
  ]),
}))

jest.mock("@/hooks/common/sort/post-sort-options", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    data: [
      { label: "Latest", value: "latest" },
      { label: "Popular", value: "popular" },
    ],
  })),
}))

jest.mock("@/hooks/common/sort/referral-sort-options", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    data: [
      { label: "Newest", value: "newest" },
      { label: "Oldest", value: "oldest" },
    ],
  })),
}))

// Mock child components
jest.mock("@/modules/post/components/comboboxes/industry", () => ({
  __esModule: true,
  default: jest.fn(({ onIndustryChange, industries }) => (
    <div data-testid="industry-combobox">
      <button onClick={() => onIndustryChange(["industry-1", "industry-2"])}>
        Change Industry
      </button>
      <span>{industries.size} selected</span>
    </div>
  )),
}))

jest.mock("@/components/customized-ui/inputs/text", () => ({
  __esModule: true,
  default: jest.fn(({ onChange, value, placeholder }) => (
    <input
      data-testid="text-input"
      onChange={onChange}
      value={value}
      placeholder={placeholder}
    />
  )),
}))

jest.mock("@/components/customized-ui/selects/base", () => ({
  __esModule: true,
  default: jest.fn(
    ({ onChange, value, options, placeholder, showAllOption }) => (
      <select
        data-testid={placeholder}
        onChange={(e) => onChange(e.target.value)}
        value={value}
      >
        {showAllOption && <option value="all">All</option>}
        {options?.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    )
  ),
}))

jest.mock("@/components/customized-ui/sliders/year-of-experience", () => ({
  __esModule: true,
  default: jest.fn(({ value, onChange }) => (
    <input
      data-testid="experience-slider"
      type="range"
      value={value[0]}
      onChange={(e) => onChange(Number(e.target.value))}
      min="0"
      max="30"
    />
  )),
}))

jest.mock("@/components/customized-ui/buttons/clear-all", () => ({
  __esModule: true,
  default: jest.fn(({ onClick }) => (
    <button data-testid="clear-all-button" onClick={onClick}>
      Clear All
    </button>
  )),
}))

jest.mock("@/components/icons", () => ({
  Icons: {
    search: jest.fn(() => <span>SearchIcon</span>),
  },
}))

describe("SearchBar Component", () => {
  const mockLocationList: TLocationData[] = [
    {
      id: 1,
      uuid: "hk-uuid",
      value: "hong-kong",
      english_name: "Hong Kong",
      cantonese_name: "香港",
      level: 1,
      parent_uuid: null,
      country_uuid: "hk-uuid",
      meta_data: { emoji: "🇭🇰" },
    },
    {
      id: 2,
      uuid: "sg-uuid",
      value: "singapore",
      english_name: "Singapore",
      cantonese_name: "新加坡",
      level: 1,
      parent_uuid: null,
      country_uuid: "sg-uuid",
      meta_data: { emoji: "🇸🇬" },
    },
  ]

  const mockIndustryList: IIndustryResponse[] = [
    {
      id: 1,
      uuid: "industry-1",
      value: "tech",
      english_name: "Technology",
      cantonese_name: "科技",
    },
    {
      id: 2,
      uuid: "industry-2",
      value: "finance",
      english_name: "Finance",
      cantonese_name: "金融",
    },
  ]

  const defaultProps = {
    onKeyWordsChange: jest.fn(),
    onIndustryChange: jest.fn(),
    onSortingChange: jest.fn(),
    currentSorting: "latest",
    type: EMessageType.POST,
    locationList: mockLocationList,
    industryList: mockIndustryList,
    onLocationChange: jest.fn(),
    location: "all",
    industries: new Set(["industry-1"]),
    keywords: "",
    handleReset: jest.fn(),
    experience: 0,
    onExperienceChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("Rendering", () => {
    it("should render the search bar with all components", () => {
      render(<SearchBar {...defaultProps} />)

      expect(screen.getByTestId("text-input")).toBeInTheDocument()
      expect(screen.getByTestId("industry-combobox")).toBeInTheDocument()
      expect(screen.getByTestId("general.location")).toBeInTheDocument()
      expect(screen.getByTestId("general.sorting")).toBeInTheDocument()
      expect(screen.getByTestId("experience-slider")).toBeInTheDocument()
      expect(screen.getByTestId("clear-all-button")).toBeInTheDocument()
    })

    it("should render with keywords input value", () => {
      render(<SearchBar {...defaultProps} keywords="test keywords" />)

      const input = screen.getByTestId("text-input") as HTMLInputElement
      expect(input.value).toBe("test keywords")
    })

    it("should render with selected location", () => {
      render(<SearchBar {...defaultProps} location="hong-kong" />)

      const locationSelect = screen.getByTestId(
        "general.location"
      ) as HTMLSelectElement
      expect(locationSelect.value).toBe("hk-uuid")
    })

    it("should render with experience value", () => {
      render(<SearchBar {...defaultProps} experience={5} />)

      const slider = screen.getByTestId("experience-slider") as HTMLInputElement
      expect(slider.value).toBe("5")
    })

    it("should render bottomLeftSection when provided", () => {
      const bottomSection = (
        <div data-testid="bottom-section">Bottom Section</div>
      )
      render(<SearchBar {...defaultProps} bottomLeftSection={bottomSection} />)

      expect(screen.getByTestId("bottom-section")).toBeInTheDocument()
    })
  })

  describe("Keywords Input", () => {
    it("should call onKeyWordsChange when typing", () => {
      render(<SearchBar {...defaultProps} />)

      const input = screen.getByTestId("text-input")
      fireEvent.change(input, { target: { value: "new search" } })

      expect(defaultProps.onKeyWordsChange).toHaveBeenCalled()
    })

    it("should display placeholder text", () => {
      render(<SearchBar {...defaultProps} />)

      const input = screen.getByPlaceholderText("search.keywords.placeholder")
      expect(input).toBeInTheDocument()
    })
  })

  describe("Location Select", () => {
    it("should call onLocationChange when location is selected", () => {
      render(<SearchBar {...defaultProps} />)

      const locationSelect = screen.getByTestId("general.location")
      fireEvent.change(locationSelect, { target: { value: "hk-uuid" } })

      expect(defaultProps.onLocationChange).toHaveBeenCalledWith("hk-uuid")
    })

    it("should show 'all' option when location is not selected", () => {
      render(<SearchBar {...defaultProps} location="all" />)

      const locationSelect = screen.getByTestId(
        "general.location"
      ) as HTMLSelectElement
      expect(locationSelect.value).toBe("all")
    })

    it("should display correct UUID for selected location value", () => {
      render(<SearchBar {...defaultProps} location="singapore" />)

      const locationSelect = screen.getByTestId(
        "general.location"
      ) as HTMLSelectElement
      expect(locationSelect.value).toBe("sg-uuid")
    })
  })

  describe("Industry Combobox", () => {
    it("should call onIndustryChange when industries are selected", () => {
      render(<SearchBar {...defaultProps} />)

      const changeButton = screen.getByText("Change Industry")
      fireEvent.click(changeButton)

      expect(defaultProps.onIndustryChange).toHaveBeenCalledWith([
        "industry-1",
        "industry-2",
      ])
    })

    it("should display number of selected industries", () => {
      const industries = new Set(["industry-1", "industry-2", "industry-3"])
      render(<SearchBar {...defaultProps} industries={industries} />)

      expect(screen.getByText("3 selected")).toBeInTheDocument()
    })
  })

  describe("Sorting Select", () => {
    it("should call onSortingChange when sorting is changed", () => {
      render(<SearchBar {...defaultProps} />)

      const sortingSelect = screen.getByTestId("general.sorting")
      fireEvent.change(sortingSelect, { target: { value: "popular" } })

      expect(defaultProps.onSortingChange).toHaveBeenCalledWith("popular")
    })

    it("should use post sorting options for POST type", () => {
      render(<SearchBar {...defaultProps} type={EMessageType.POST} />)

      const sortingSelect = screen.getByTestId("general.sorting")
      expect(sortingSelect).toBeInTheDocument()
      // The mock returns post sorting options
    })

    it("should use referral sorting options for REFERRAL type", () => {
      render(<SearchBar {...defaultProps} type={EMessageType.REFERRAL} />)

      const sortingSelect = screen.getByTestId("general.sorting")
      expect(sortingSelect).toBeInTheDocument()
      // The mock returns referral sorting options
    })

    it("should display current sorting value", () => {
      render(<SearchBar {...defaultProps} currentSorting="popular" />)

      const sortingSelect = screen.getByTestId(
        "general.sorting"
      ) as HTMLSelectElement
      expect(sortingSelect.value).toBe("popular")
    })
  })

  describe("Experience Slider", () => {
    it("should call onExperienceChange when slider is moved", () => {
      render(<SearchBar {...defaultProps} />)

      const slider = screen.getByTestId("experience-slider")
      fireEvent.change(slider, { target: { value: "10" } })

      expect(defaultProps.onExperienceChange).toHaveBeenCalledWith(10)
    })

    it("should display current experience value", () => {
      render(<SearchBar {...defaultProps} experience={15} />)

      const slider = screen.getByTestId("experience-slider") as HTMLInputElement
      expect(slider.value).toBe("15")
    })
  })

  describe("Clear All Button", () => {
    it("should call handleReset when clicked", () => {
      render(<SearchBar {...defaultProps} />)

      const clearButton = screen.getByTestId("clear-all-button")
      fireEvent.click(clearButton)

      expect(defaultProps.handleReset).toHaveBeenCalled()
    })
  })

  describe("Integration Tests", () => {
    it("should handle multiple filter changes", () => {
      render(<SearchBar {...defaultProps} />)

      // Change keywords
      const input = screen.getByTestId("text-input")
      fireEvent.change(input, { target: { value: "developer" } })

      // Change location
      const locationSelect = screen.getByTestId("general.location")
      fireEvent.change(locationSelect, { target: { value: "hk-uuid" } })

      // Change sorting
      const sortingSelect = screen.getByTestId("general.sorting")
      fireEvent.change(sortingSelect, { target: { value: "popular" } })

      expect(defaultProps.onKeyWordsChange).toHaveBeenCalled()
      expect(defaultProps.onLocationChange).toHaveBeenCalledWith("hk-uuid")
      expect(defaultProps.onSortingChange).toHaveBeenCalledWith("popular")
    })

    it("should handle reset after making changes", () => {
      const { rerender } = render(
        <SearchBar {...defaultProps} keywords="test" />
      )

      const clearButton = screen.getByTestId("clear-all-button")
      fireEvent.click(clearButton)

      expect(defaultProps.handleReset).toHaveBeenCalled()

      // Simulate reset by re-rendering with default values
      rerender(
        <SearchBar
          {...defaultProps}
          keywords=""
          location="all"
          experience={0}
        />
      )

      const input = screen.getByTestId("text-input") as HTMLInputElement
      expect(input.value).toBe("")
    })
  })

  describe("Props Validation", () => {
    it("should handle empty locationList", () => {
      render(<SearchBar {...defaultProps} locationList={[]} />)

      const locationSelect = screen.getByTestId("general.location")
      expect(locationSelect).toBeInTheDocument()
    })

    it("should handle empty industryList", () => {
      render(<SearchBar {...defaultProps} industryList={[]} />)

      const industryCombobox = screen.getByTestId("industry-combobox")
      expect(industryCombobox).toBeInTheDocument()
    })

    it("should handle empty industries set", () => {
      render(<SearchBar {...defaultProps} industries={new Set()} />)

      expect(screen.getByText("0 selected")).toBeInTheDocument()
    })
  })

  describe("Accessibility", () => {
    it("should have labels for all inputs", () => {
      render(<SearchBar {...defaultProps} />)

      expect(screen.getByText("general.industry")).toBeInTheDocument()
      expect(screen.getByText("general.location")).toBeInTheDocument()
      expect(screen.getByText("general.sorting")).toBeInTheDocument()
      expect(screen.getByText("general.year_of_experience")).toBeInTheDocument()
    })
  })

  describe("Edge Cases", () => {
    it("should handle location not in locationList", () => {
      render(<SearchBar {...defaultProps} location="non-existent" />)

      const locationSelect = screen.getByTestId(
        "general.location"
      ) as HTMLSelectElement
      expect(locationSelect.value).toBe("all")
    })

    it("should handle very large industries set", () => {
      const largeSet = new Set(
        Array.from({ length: 100 }, (_, i) => `industry-${i}`)
      )
      render(<SearchBar {...defaultProps} industries={largeSet} />)

      expect(screen.getByText("100 selected")).toBeInTheDocument()
    })

    it("should handle experience value of 0", () => {
      render(<SearchBar {...defaultProps} experience={0} />)

      const slider = screen.getByTestId("experience-slider") as HTMLInputElement
      expect(slider.value).toBe("0")
    })

    it("should handle maximum experience value", () => {
      render(<SearchBar {...defaultProps} experience={30} />)

      const slider = screen.getByTestId("experience-slider") as HTMLInputElement
      expect(slider.value).toBe("30")
    })
  })
})
