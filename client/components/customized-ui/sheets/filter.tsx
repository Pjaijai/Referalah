import React from "react"
import IndustryInput from "@/modules/post/components/selects/industry"
import LocationSelect from "@/modules/post/components/selects/location"
import { useI18n } from "@/utils/services/internationalization/client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ISearchSearchBarProps } from "@/components/customized-ui/bars/search"
import ClearAllButton from "@/components/customized-ui/buttons/clear-all"
import YearOfExperienceSlider from "@/components/customized-ui/sliders/year-of-experience"
import { Icons } from "@/components/icons"

interface IFilterSheet
  extends Pick<
    ISearchSearchBarProps,
    | "onIndustryChange"
    | "locations"
    | "onLocationChange"
    | "cityList"
    | "countryList"
    | "industryList"
    | "provinceList"
    | "industries"
    | "onExperienceChange"
    | "experience"
    | "handleReset"
  > {}
const FilterSheet: React.FunctionComponent<IFilterSheet> = ({
  onIndustryChange,
  locations,
  onLocationChange,
  cityList,
  countryList,
  industryList,
  provinceList,
  industries,
  onExperienceChange,
  experience,
  handleReset,
}) => {
  const t = useI18n()

  return (
    <Sheet>
      <SheetTrigger>
        <Button variant={"theme"}>
          <Icons.slidersHorizontal width={25} height={25} />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={"left"}
        showCloseBtn={false}
        className="overflow-x-auto"
      >
        <div className="flex flex-col">
          <p className="text-sm font-medium">{t("general.industry")}</p>
          <IndustryInput
            containerClassName="mt-2"
            industries={industries}
            industryList={industryList}
            onIndustryChange={onIndustryChange}
          />

          <label className="mt-6  text-sm font-medium">
            {t("general.year_of_experience")}
          </label>

          <div className="mt-8  w-full">
            <YearOfExperienceSlider
              value={[experience]}
              onChange={onExperienceChange}
            />
          </div>
          <p className="mt-8 text-sm font-medium">{t("general.region")}</p>
          <LocationSelect
            containerClassName="mt-2"
            countryList={countryList}
            provinceList={provinceList}
            cityList={cityList}
            locations={locations}
            onLocationChange={onLocationChange}
          />
        </div>

        <div className="flex justify-end">
          <ClearAllButton onClick={handleReset} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default FilterSheet
