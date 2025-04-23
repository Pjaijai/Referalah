"use client"

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
import ClearAllButton from "@/components/customized-ui/buttons/clear-all"
import CompanyCombobox from "@/components/customized-ui/comboboxes/company"
import TextInput from "@/components/customized-ui/inputs/text"
import BaseSelect from "@/components/customized-ui/selects/base"
import { Icons } from "@/components/icons"

type TJobJourneySearchBarProps = {
  onKeywordsChange: (e: React.ChangeEvent<HTMLInputElement>) => void
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
  currentJobLevel: EJobLevel | "all"
  currentLocation: string
  locationData: TLocationData[]
  currentIndustry: string
  keywords: string
  industryData: IIndustryResponse[]
  onReset: () => void
}
const JobJourneySearchBar = ({
  onKeywordsChange,
  onJobLevelChange,
  onCompanyChange,
  keywords,
  locationData,
  currentJobLevel,
  currentCompany,
  currentIndustry,
  onIndustryChange,
  industryData,
  onSortingChange,
  currentSorting,
  onLocationChange,
  currentLocation,
  onReset,
}: TJobJourneySearchBarProps) => {
  const t = useI18n()
  const locale = useCurrentLocale()
  const locationOptions = useLocationOptionsList(locationData, false, locale)
  const jobLevelOptions = useJobLevelOptions()

  const industryOptions = useIndustryOptions(industryData)
  const sortingOptions = useJobJourneySortOptions()
  const currentLocationUuid =
    locationData.find((i) => i.value === currentLocation)?.uuid || "all"

  return (
    <div className="hidden grid-cols-8 flex-col justify-center gap-5 md:grid">
      <div className="col-span-2">
        <TextInput
          onChange={onKeywordsChange}
          value={keywords}
          frontIcon={<Icons.search size={18} className="text-slate-400" />}
          inputClassName="bg-slate-100 w-full"
          placeholder={t("search.keywords.placeholder")}
        />
      </div>
      <BaseSelect
        options={locationOptions}
        onChange={onLocationChange}
        value={currentLocationUuid}
        placeholder={t("general.location")}
        triggerClassName="w-full col-span-1"
        showAllOption
        allOptionLabel={t("general.all_locations")}
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

      <div className="flex justify-center">
        <ClearAllButton onClick={onReset} />
      </div>

      <BaseSelect
        options={sortingOptions}
        onChange={onSortingChange}
        defaultValue={sortingOptions[0].value}
        value={currentSorting}
        placeholder={t("general.sorting")}
      />
    </div>
  )
}
export default JobJourneySearchBar
