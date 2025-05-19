import React from "react"
import {
  useCurrentLocale,
  useI18n,
} from "@/utils/services/internationalization/client"

import { IIndustryResponse } from "@/types/api/response/industry"
import { TLocationData } from "@/types/api/response/location"
import { EJobLevel } from "@/types/common/enums/job-level"
import { EJobType } from "@/types/common/enums/job-type"
import useJobLevelOptions from "@/hooks/common/options/Job-level-options"
import useJobTypeOptions from "@/hooks/common/options/Job-type-options"
import useIndustryOptions from "@/hooks/common/options/industry-options"
import useLocationOptionsList from "@/hooks/common/options/location-options-list"
import useJobJourneySortOptions from "@/hooks/common/sort/job-journey-sort-options"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import ClearAllButton from "@/components/customized-ui/buttons/clear-all"
import CompanyCombobox from "@/components/customized-ui/comboboxes/company"
import BaseSelect from "@/components/customized-ui/selects/base"
import { Icons } from "@/components/icons"

type TFilterSheetProps = {
  onJobLevelChange: (v: EJobLevel | "all") => void
  onCompanyChange: (
    name: string | null,
    id: number | null,
    reset: boolean
  ) => void
  onIndustryChange: (v: string) => void
  onSortingChange: (v: string) => void
  onLocationChange: (v: string) => void
  currentSorting: string
  currentCompany: {
    name: string
    id: number
  } | null
  currentJobLevel: string
  currentLocation: string
  locationData: TLocationData[]
  currentIndustry: string
  industryData: IIndustryResponse[]
  onReset: () => void
}
const FilterSheet: React.FunctionComponent<TFilterSheetProps> = ({
  onJobLevelChange,
  onCompanyChange,
  locationData,
  currentCompany,
  currentIndustry,
  onIndustryChange,
  industryData,
  onSortingChange,
  currentSorting,
  onLocationChange,
  currentLocation,
  onReset,
  currentJobLevel,
}) => {
  const t = useI18n()

  const locale = useCurrentLocale()
  const locationOptions = useLocationOptionsList(locationData, false, locale)
  const jobLevelOptions = useJobLevelOptions()
  const jobTypeOptions = useJobTypeOptions()
  const industryOptions = useIndustryOptions(industryData)
  const sortingOptions = useJobJourneySortOptions()
  const currentLocationUuid =
    locationData.find((i) => i.value === currentLocation)?.uuid || "all"

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
        <div className="flex flex-col gap-2">
          <BaseSelect
            options={locationOptions}
            onChange={onLocationChange}
            value={currentLocationUuid}
            placeholder={t("general.location")}
            triggerClassName="w-full col-span-1"
            allOptionLabel={t("general.all_locations")}
            showAllOption
          />

          <BaseSelect
            options={industryOptions}
            onChange={onIndustryChange}
            value={currentIndustry}
            showAllOption
            placeholder={t("general.industry")}
            triggerClassName="w-full col-span-1"
            allOptionLabel={t("general.all_industries")}
          />

          <CompanyCombobox
            company={currentCompany}
            onSelect={onCompanyChange}
            className="col-span-1 w-full"
          />

          <BaseSelect
            options={jobLevelOptions}
            onChange={onJobLevelChange}
            value={currentJobLevel}
            showAllOption
            triggerClassName="w-full col-span-1"
            allOptionLabel={t("job_journey.form.all_job_level")}
          />

          <BaseSelect
            options={sortingOptions}
            onChange={onSortingChange}
            defaultValue={sortingOptions[0].value}
            value={currentSorting}
            triggerClassName="w-full"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <ClearAllButton onClick={onReset} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default FilterSheet
