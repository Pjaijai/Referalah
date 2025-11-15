import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"

import "@testing-library/jest-dom"
import { IIndustryResponse } from "@/types/api/response/industry"
import { TLocationData } from "@/types/api/response/location"

import FilterSheet from "./filter"

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

// Mock UI components
jest.mock("@/components/ui/button", () => ({
  Button: jest.fn(({ children, onClick, variant }) => (
    <button
      data-testid="trigger-button"
      onClick={onClick}
      data-variant={variant}
    >
      {children}
    </button>
  )),
}))

jest.mock("@/components/ui/sheet", () => ({
  Sheet: jest.fn(({ children }) => <div data-testid="sheet">{children}</div>),
  SheetTrigger: jest.fn(({ children }) => (
    <div data-testid="sheet-trigger">{children}</div>
  )),
  SheetContent: jest.fn(({ children, side, showCloseBtn, onOpenAutoFocus }) => (
    <div
      data-testid="sheet-content"
      data-side={side}
      data-show-close={showCloseBtn}
    >
      {children}
    </div>
  )),
}))

// Mock child components
jest.mock("@/modules/post/components/selects/industry", () => ({
  __esModule: true,
  default: jest.fn(({ onIndustryChange, industries, industryList }) => (
    <div data-testid="industry-input">
      <button onClick={() => onIndustryChange(["industry-1", "industry-2"])}>
        Change Industry
      </button>
      <span>{industries.size} selected</span>
      <span>{industryList.length} total</span>
    </div>
  )),
}))

jest.mock("@/components/customized-ui/selects/base", () => ({
  __esModule: true,
  default: jest.fn(
    ({
      onChange,
      value,
      options,
      placeholder,
      showAllOption,
      allOptionLabel,
    }) => (
      <select
        data-testid="location-select"
        onChange={(e) => onChange(e.target.value)}
        value={value}
        data-placeholder={placeholder}
        data-show-all={showAllOption}
        data-all-label={allOptionLabel}
      >
        {showAllOption && <option value="all">{allOptionLabel}</option>}
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
    slidersHorizontal: jest.fn((props) => (
      <span
        data-testid="slider-icon"
        data-width={props.width}
        data-height={props.height}
      >
        SliderIcon
      </span>
    )),
  },
}))

describe("FilterSheet Component", () => {
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
    onIndustryChange: jest.fn(),
    location: "all",
    onLocationChange: jest.fn(),
    locationList: mockLocationList,
    industryList: mockIndustryList,
    industries: new Set(["industry-1"]),
    onExperienceChange: jest.fn(),
    experience: 0,
    handleReset: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("Rendering", () => {
    it("should render the filter sheet with trigger button", () => {
      render(<FilterSheet {...defaultProps} />)

      expect(screen.getByTestId("sheet")).toBeInTheDocument()
      expect(screen.getByTestId("sheet-trigger")).toBeInTheDocument()
      expect(screen.getByTestId("trigger-button")).toBeInTheDocument()
    })

    it("should render the slider icon in trigger button", () => {
      render(<FilterSheet {...defaultProps} />)

      const icon = screen.getByTestId("slider-icon")
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveAttribute("data-width", "25")
      expect(icon).toHaveAttribute("data-height", "25")
    })

    it("should render sheet content with left side", () => {
      render(<FilterSheet {...defaultProps} />)

      const content = screen.getByTestId("sheet-content")
      expect(content).toBeInTheDocument()
      expect(content).toHaveAttribute("data-side", "left")
      expect(content).toHaveAttribute("data-show-close", "false")
    })

    it("should render all filter components", () => {
      render(<FilterSheet {...defaultProps} />)

      expect(screen.getByTestId("industry-input")).toBeInTheDocument()
      expect(screen.getByTestId("experience-slider")).toBeInTheDocument()
      expect(screen.getByTestId("location-select")).toBeInTheDocument()
      expect(screen.getByTestId("clear-all-button")).toBeInTheDocument()
    })

    it("should render all section labels", () => {
      render(<FilterSheet {...defaultProps} />)

      expect(screen.getByText("general.industry")).toBeInTheDocument()
      expect(screen.getByText("general.year_of_experience")).toBeInTheDocument()
      expect(screen.getByText("general.location")).toBeInTheDocument()
    })
  })

  describe("Industry Input", () => {
    it("should pass industries prop to IndustryInput", () => {
      const industries = new Set(["industry-1", "industry-2"])
      render(<FilterSheet {...defaultProps} industries={industries} />)

      expect(screen.getByText("2 selected")).toBeInTheDocument()
    })

    it("should pass industryList prop to IndustryInput", () => {
      render(<FilterSheet {...defaultProps} />)

      expect(screen.getByText("2 total")).toBeInTheDocument()
    })

    it("should call onIndustryChange when industry is changed", () => {
      render(<FilterSheet {...defaultProps} />)

      const changeButton = screen.getByText("Change Industry")
      fireEvent.click(changeButton)

      expect(defaultProps.onIndustryChange).toHaveBeenCalledWith([
        "industry-1",
        "industry-2",
      ])
    })

    it("should handle empty industries set", () => {
      render(<FilterSheet {...defaultProps} industries={new Set()} />)

      expect(screen.getByText("0 selected")).toBeInTheDocument()
    })
  })

  describe("Experience Slider", () => {
    it("should render slider with correct experience value", () => {
      render(<FilterSheet {...defaultProps} experience={5} />)

      const slider = screen.getByTestId("experience-slider") as HTMLInputElement
      expect(slider.value).toBe("5")
    })

    it("should call onExperienceChange when slider is moved", () => {
      render(<FilterSheet {...defaultProps} />)

      const slider = screen.getByTestId("experience-slider")
      fireEvent.change(slider, { target: { value: "10" } })

      expect(defaultProps.onExperienceChange).toHaveBeenCalledWith(10)
    })

    it("should handle experience value of 0", () => {
      render(<FilterSheet {...defaultProps} experience={0} />)

      const slider = screen.getByTestId("experience-slider") as HTMLInputElement
      expect(slider.value).toBe("0")
    })

    it("should handle maximum experience value", () => {
      render(<FilterSheet {...defaultProps} experience={30} />)

      const slider = screen.getByTestId("experience-slider") as HTMLInputElement
      expect(slider.value).toBe("30")
    })
  })

  describe("Location Select", () => {
    it("should render location select with unified location system", () => {
      render(<FilterSheet {...defaultProps} />)

      const select = screen.getByTestId("location-select")
      expect(select).toBeInTheDocument()
      expect(select).toHaveAttribute("data-show-all", "true")
      expect(select).toHaveAttribute("data-all-label", "general.all_locations")
    })

    it("should display 'all' when no location is selected", () => {
      render(<FilterSheet {...defaultProps} location="all" />)

      const select = screen.getByTestId("location-select") as HTMLSelectElement
      expect(select.value).toBe("all")
    })

    it("should convert location value to UUID correctly", () => {
      render(<FilterSheet {...defaultProps} location="hong-kong" />)

      const select = screen.getByTestId("location-select") as HTMLSelectElement
      expect(select.value).toBe("hk-uuid")
    })

    it("should convert different location value to correct UUID", () => {
      render(<FilterSheet {...defaultProps} location="singapore" />)

      const select = screen.getByTestId("location-select") as HTMLSelectElement
      expect(select.value).toBe("sg-uuid")
    })

    it("should call onLocationChange with UUID when location is selected", () => {
      render(<FilterSheet {...defaultProps} />)

      const select = screen.getByTestId("location-select")
      fireEvent.change(select, { target: { value: "hk-uuid" } })

      expect(defaultProps.onLocationChange).toHaveBeenCalledWith("hk-uuid")
    })

    it("should handle location not in locationList", () => {
      render(<FilterSheet {...defaultProps} location="non-existent" />)

      const select = screen.getByTestId("location-select") as HTMLSelectElement
      expect(select.value).toBe("all")
    })

    it("should pass locationList to useLocationOptionsList hook", () => {
      const useLocationOptionsList =
        require("@/hooks/common/options/location-options-list").default
      render(<FilterSheet {...defaultProps} />)

      expect(useLocationOptionsList).toHaveBeenCalledWith(
        mockLocationList,
        false,
        "en"
      )
    })
  })

  describe("Clear All Button", () => {
    it("should render clear all button", () => {
      render(<FilterSheet {...defaultProps} />)

      expect(screen.getByTestId("clear-all-button")).toBeInTheDocument()
    })

    it("should call handleReset when clear all is clicked", () => {
      render(<FilterSheet {...defaultProps} />)

      const clearButton = screen.getByTestId("clear-all-button")
      fireEvent.click(clearButton)

      expect(defaultProps.handleReset).toHaveBeenCalledTimes(1)
    })
  })

  describe("Integration Tests", () => {
    it("should handle multiple filter changes", () => {
      render(<FilterSheet {...defaultProps} />)

      // Change industry
      const industryButton = screen.getByText("Change Industry")
      fireEvent.click(industryButton)

      // Change experience
      const slider = screen.getByTestId("experience-slider")
      fireEvent.change(slider, { target: { value: "5" } })

      // Change location
      const locationSelect = screen.getByTestId("location-select")
      fireEvent.change(locationSelect, { target: { value: "hk-uuid" } })

      expect(defaultProps.onIndustryChange).toHaveBeenCalled()
      expect(defaultProps.onExperienceChange).toHaveBeenCalledWith(5)
      expect(defaultProps.onLocationChange).toHaveBeenCalledWith("hk-uuid")
    })

    it("should reset all filters when clear all is clicked", () => {
      const { rerender } = render(
        <FilterSheet {...defaultProps} experience={10} location="hong-kong" />
      )

      const clearButton = screen.getByTestId("clear-all-button")
      fireEvent.click(clearButton)

      expect(defaultProps.handleReset).toHaveBeenCalled()

      // Simulate reset
      rerender(<FilterSheet {...defaultProps} experience={0} location="all" />)

      const slider = screen.getByTestId("experience-slider") as HTMLInputElement
      expect(slider.value).toBe("0")

      const locationSelect = screen.getByTestId(
        "location-select"
      ) as HTMLSelectElement
      expect(locationSelect.value).toBe("all")
    })
  })

  describe("Props Validation", () => {
    it("should handle empty locationList", () => {
      render(<FilterSheet {...defaultProps} locationList={[]} />)

      const select = screen.getByTestId("location-select")
      expect(select).toBeInTheDocument()
    })

    it("should handle empty industryList", () => {
      render(<FilterSheet {...defaultProps} industryList={[]} />)

      expect(screen.getByText("0 total")).toBeInTheDocument()
    })

    it("should handle location with single item in list", () => {
      const singleLocation: TLocationData[] = [
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
      ]
      render(<FilterSheet {...defaultProps} locationList={singleLocation} />)

      const select = screen.getByTestId("location-select")
      expect(select).toBeInTheDocument()
    })
  })

  describe("Location Migration Compatibility", () => {
    it("should use unified location system instead of city/province/country", () => {
      render(<FilterSheet {...defaultProps} />)

      // Should NOT have separate city, province, country inputs
      expect(screen.queryByTestId("city-select")).not.toBeInTheDocument()
      expect(screen.queryByTestId("province-select")).not.toBeInTheDocument()
      expect(screen.queryByTestId("country-select")).not.toBeInTheDocument()

      // Should have single location select
      expect(screen.getByTestId("location-select")).toBeInTheDocument()
    })

    it("should handle hierarchical location data", () => {
      const hierarchicalLocations: TLocationData[] = [
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
          uuid: "hk-island-uuid",
          value: "hong-kong-island",
          english_name: "Hong Kong Island",
          cantonese_name: "香港島",
          level: 2,
          parent_uuid: "hk-uuid",
          country_uuid: "hk-uuid",
          meta_data: { emoji: null },
        },
        {
          id: 3,
          uuid: "central-uuid",
          value: "central",
          english_name: "Central",
          cantonese_name: "中環",
          level: 3,
          parent_uuid: "hk-island-uuid",
          country_uuid: "hk-uuid",
          meta_data: { emoji: null },
        },
      ]

      render(
        <FilterSheet {...defaultProps} locationList={hierarchicalLocations} />
      )

      const select = screen.getByTestId("location-select")
      expect(select).toBeInTheDocument()
    })

    it("should correctly map location value to UUID for filtering", () => {
      render(<FilterSheet {...defaultProps} location="hong-kong" />)

      const select = screen.getByTestId("location-select") as HTMLSelectElement
      // Should show UUID, not the value
      expect(select.value).toBe("hk-uuid")
      expect(select.value).not.toBe("hong-kong")
    })
  })

  describe("Edge Cases", () => {
    it("should handle very large industries set", () => {
      const largeSet = new Set(
        Array.from({ length: 100 }, (_, i) => `industry-${i}`)
      )
      render(<FilterSheet {...defaultProps} industries={largeSet} />)

      expect(screen.getByText("100 selected")).toBeInTheDocument()
    })

    it("should handle special characters in location names", () => {
      const specialLocations: TLocationData[] = [
        {
          id: 1,
          uuid: "special-uuid",
          value: "location-with-special-chars",
          english_name: "Location & Special <Chars>",
          cantonese_name: "特殊字符",
          level: 1,
          parent_uuid: null,
          country_uuid: "special-uuid",
          meta_data: { emoji: null },
        },
      ]

      render(<FilterSheet {...defaultProps} locationList={specialLocations} />)

      const select = screen.getByTestId("location-select")
      expect(select).toBeInTheDocument()
    })
  })

  describe("Accessibility", () => {
    it("should have proper labels for all inputs", () => {
      render(<FilterSheet {...defaultProps} />)

      expect(screen.getByText("general.industry")).toBeInTheDocument()
      expect(screen.getByText("general.year_of_experience")).toBeInTheDocument()
      expect(screen.getByText("general.location")).toBeInTheDocument()
    })

    it("should have theme variant button for trigger", () => {
      render(<FilterSheet {...defaultProps} />)

      const button = screen.getByTestId("trigger-button")
      expect(button).toHaveAttribute("data-variant", "theme")
    })
  })
})
