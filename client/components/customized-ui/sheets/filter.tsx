import React from "react"
import IndustryInput from "@/modules/post/components/selects/industry"
import {
  useCurrentLocale,
  useI18n,
} from "@/utils/services/internationalization/client"

import useLocationOptionsList from "@/hooks/common/options/location-options-list"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ISearchSearchBarProps } from "@/components/customized-ui/bars/search"
import ClearAllButton from "@/components/customized-ui/buttons/clear-all"
import BaseSelect from "@/components/customized-ui/selects/base"
import YearOfExperienceSlider from "@/components/customized-ui/sliders/year-of-experience"
import { Icons } from "@/components/icons"

interface IFilterSheet
  extends Pick<
    ISearchSearchBarProps,
    | "onIndustryChange"
    | "location"
    | "onLocationChange"
    | "locationList"
    | "industryList"
    | "industries"
    | "onExperienceChange"
    | "experience"
    | "handleReset"
  > {}
const FilterSheet: React.FunctionComponent<IFilterSheet> = ({
  onIndustryChange,
  location,
  onLocationChange,
  locationList,
  industryList,
  industries,
  onExperienceChange,
  experience,
  handleReset,
}) => {
  const t = useI18n()
  const locale = useCurrentLocale()
  const locationOptions = useLocationOptionsList(locationList, false, locale)
  const currentLocationUuid =
    locationList.find((i) => i.value === location)?.uuid || "all"

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
        onOpenAutoFocus={(e) => e.preventDefault()}
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
          <p className="mt-8 text-sm font-medium">{t("general.location")}</p>
          <BaseSelect
            options={locationOptions}
            onChange={onLocationChange}
            value={currentLocationUuid}
            placeholder={t("general.location")}
            triggerClassName="w-full mt-2"
            showAllOption
            allOptionLabel={t("general.all_locations")}
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
