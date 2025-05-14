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
    // <div className="hidden grid-cols-8 flex-col justify-center gap-5 md:grid">
    <div className="hidden flex-row flex-wrap justify-center gap-5 md:flex">
      <div className="min-w-[200px] flex-[10_1_0%]">
        <TextInput
          onChange={onKeywordsChange}
          value={keywords}
          frontIcon={<Icons.search size={18} className="text-slate-400" />}
          inputClassName="bg-slate-100 w-full"
          placeholder={t("search.keywords.placeholder")}
        />
      </div>
      <div className="min-w-[150px] flex-1">
        <BaseSelect
          options={locationOptions}
          onChange={onLocationChange}
          value={currentLocationUuid}
          placeholder={t("general.location")}
          triggerClassName="w-full"
          showAllOption
          allOptionLabel={t("general.all_locations")}
        />
      </div>
      <div className="min-w-[150px] flex-1">
        <BaseSelect
          options={industryOptions}
          onChange={onIndustryChange}
          value={currentIndustry}
          showAllOption
          placeholder={t("general.industry")}
          triggerClassName="w-full"
          allOptionLabel={t("general.all_industries")}
        />
      </div>
      <div className="min-w-[150px] flex-1">
        <CompanyCombobox
          company={currentCompany}
          onSelect={onCompanyChange}
          className="w-full"
        />
      </div>
      <div className="min-w-[150px] flex-1">
        <BaseSelect
          options={jobLevelOptions}
          onChange={onJobLevelChange}
          value={currentJobLevel}
          showAllOption
          triggerClassName="w-full"
          allOptionLabel={t("job_journey.form.all_job_level")}
        />
      </div>
      <div className="flex w-fit ">
        <ClearAllButton onClick={onReset} />
      </div>
      <div className="w-fit flex-1">
        <BaseSelect
          options={sortingOptions}
          onChange={onSortingChange}
          defaultValue={sortingOptions[0].value}
          value={currentSorting}
          placeholder={t("general.sorting")}
        />
      </div>
    </div>
  )
}
export default JobJourneySearchBar
