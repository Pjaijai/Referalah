import React, { ChangeEvent, KeyboardEventHandler } from "react"
import { useI18n } from "@/utils/services/internationalization/client"

import { ICityResponse } from "@/types/api/response/city"
import { ICountryResponse } from "@/types/api/response/country"
import { IIndustryResponse } from "@/types/api/response/industry"
import { IProvinceResponse } from "@/types/api/response/province"
import { EMessageType } from "@/types/common/message-type"
import { cn } from "@/lib/utils"
import useCityOptions from "@/hooks/common/options/city-options"
import useCountryOptions from "@/hooks/common/options/country-options"
import useIndustryOptions from "@/hooks/common/options/industry-options"
import useProvinceOptions from "@/hooks/common/options/province-options"
import usePostSortOptions from "@/hooks/common/sort/post-sort-options"
import useReferralSortOptions from "@/hooks/common/sort/referral-sort-options"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ResetButton from "@/components/customized-ui/buttons/reset"
import BaseSelect from "@/components/customized-ui/selects/base"

export interface ISearchSearchBarProps {
  countryUuid?: string
  provinceUuid?: string
  onCountryChange: (value: string) => void
  onProvinceChange: (value: string) => void
  onCityChange: (value: string) => void
  onIndustryChange: (value: string) => void
  onSortingChange: (value: string) => void
  onMinYearOfExperienceChange: (e: ChangeEvent<HTMLInputElement>) => void
  onMaxYearOfExperienceChange: (e: ChangeEvent<HTMLInputElement>) => void
  onSubmitChange: () => void
  currentCountryUuid?: string
  currentProvinceUuid?: string
  currentCityUuid?: string
  currentIndustryUuid?: string
  currentMinYearOfExperience?: string
  currentMaxYearOfExperience?: string
  currentSorting: string
  type: EMessageType
  countryList: ICountryResponse[]
  provinceList: IProvinceResponse[]
  cityList: ICityResponse[]
  industryList: IIndustryResponse[]
  handleCompanyChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleKeyPressSubmitChange: KeyboardEventHandler
  companyName: string
  handleJobTitleChange: (e: ChangeEvent<HTMLInputElement>) => void
  jobTitle: string
  handleReset: () => void
  handleSubmit: () => void
  bottomLeftSection?: React.ReactNode
}

const SearchBar: React.FunctionComponent<ISearchSearchBarProps> = ({
  provinceUuid,
  countryUuid,
  onCityChange,
  onCountryChange,
  onProvinceChange,
  onIndustryChange,
  onSortingChange,
  onMinYearOfExperienceChange,
  onMaxYearOfExperienceChange,
  currentCountryUuid,
  currentProvinceUuid,
  currentCityUuid,
  currentIndustryUuid,
  currentMinYearOfExperience,
  currentMaxYearOfExperience,
  currentSorting,
  type,
  cityList,
  countryList,
  industryList,
  provinceList,
  companyName,
  handleCompanyChange,
  handleJobTitleChange,
  handleKeyPressSubmitChange,
  jobTitle,
  handleReset,
  handleSubmit,
  bottomLeftSection,
}) => {
  const t = useI18n()
  const industryOptions = useIndustryOptions(industryList, true)
  const countryOptions = useCountryOptions(countryList, true)
  const provinceOptions = useProvinceOptions(provinceList, countryUuid, true)
  const cityOptions = useCityOptions(cityList, provinceUuid, true)
  const { data: postSortingOptions } = usePostSortOptions()
  const { data: referralSortingOptions } = useReferralSortOptions()

  return (
    <div className="mt-2">
      <div className="grid grid-cols-4 gap-2">
        <Input
          onChange={handleCompanyChange}
          onKeyDown={handleKeyPressSubmitChange}
          value={companyName}
          placeholder={t("general.company_name")}
        />
        <Input
          onChange={handleJobTitleChange}
          onKeyDown={handleKeyPressSubmitChange}
          value={jobTitle}
          placeholder={t("general.job_title")}
        />

        <BaseSelect
          options={
            type === "referral" ? referralSortingOptions : postSortingOptions
          }
          onChange={onSortingChange}
          defaultValue={
            type === "referral"
              ? referralSortingOptions[0].value
              : postSortingOptions[0].value
          }
          value={currentSorting}
          placeholder={t("general.sorting")}
          triggerClassName="w-full"
        />

        <div className="flex flex-row items-center justify-center gap-1">
          <Input
            type="number"
            onChange={onMinYearOfExperienceChange}
            value={currentMinYearOfExperience}
            placeholder={t("search.year_of_experience_placeholder")}
          />
          <p>{t("search.year_of_experience.to")}</p>
          <Input
            type="number"
            onChange={onMaxYearOfExperienceChange}
            value={currentMaxYearOfExperience}
            placeholder={t("search.year_of_experience_placeholder")}
          />
        </div>

        <BaseSelect
          options={countryOptions}
          onChange={onCountryChange}
          value={currentCountryUuid}
          placeholder={t("general.country")}
          triggerClassName="w-full"
        />

        <BaseSelect
          options={provinceOptions}
          onChange={onProvinceChange}
          value={currentProvinceUuid}
          placeholder={t("general.region")}
          triggerClassName="w-full"
          isDisabled={!!!currentCountryUuid}
        />

        <BaseSelect
          options={cityOptions}
          onChange={onCityChange}
          value={currentCityUuid}
          placeholder={t("general.city")}
          triggerClassName="w-full"
          isDisabled={!!!currentProvinceUuid}
        />

        <BaseSelect
          options={industryOptions}
          onChange={onIndustryChange}
          value={currentIndustryUuid}
          placeholder={t("general.industry")}
          triggerClassName="w-full"
        />
      </div>
      <div
        className={cn(
          "mt-4 flex w-full flex-row ",
          bottomLeftSection ? "justify-between" : "justify-end"
        )}
      >
        {bottomLeftSection}
        <div className="justify-row flex flex-row gap-2">
          <ResetButton onClick={handleReset} />
          <Button onClick={handleSubmit} className="whitespace-nowrap">
            {t("general.search")}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
