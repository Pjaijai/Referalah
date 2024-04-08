"use client"

import React, { useState } from "react"
import { useI18n } from "@/utils/services/internationalization/client"

import useCityOptions from "@/hooks/common/options/city-options"
import useCountryOptions from "@/hooks/common/options/country-options"
import useIndustryOptions from "@/hooks/common/options/industry-options"
import useProvinceOptions from "@/hooks/common/options/province-options"
import usePostSortOptions from "@/hooks/common/sort/post-sort-options"
import useReferralSortOptions from "@/hooks/common/sort/referral-sort-options"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { ISearchSearchBarProps } from "@/components/customized-ui/bars/search"
import ResetButton from "@/components/customized-ui/buttons/reset"
import BaseSelect from "@/components/customized-ui/selects/base"
import { Icons } from "@/components/icons"

interface ISearchDrawerProps extends ISearchSearchBarProps {}
const SearchDrawer: React.FunctionComponent<ISearchDrawerProps> = ({
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
}) => {
  const t = useI18n()
  const industryOptions = useIndustryOptions(industryList, true)
  const countryOptions = useCountryOptions(countryList, true)
  const provinceOptions = useProvinceOptions(provinceList, countryUuid, true)
  const cityOptions = useCityOptions(cityList, provinceUuid, true)
  const { data: postSortingOptions } = usePostSortOptions()
  const { data: referralSortingOptions } = useReferralSortOptions()
  const [open, setOpen] = useState(false)

  const handleSearchSubmit = () => {
    handleSubmit()
    setOpen(false)
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger className="fixed bottom-0 z-50 w-full">
        <div className="flex h-full w-full flex-row items-center justify-center gap-2 rounded-lg border-2 bg-background py-5">
          <Icons.slidersHorizontal />
          {t("general.filter")}
        </div>
      </DrawerTrigger>
      <DrawerContent className="fixed inset-x-0 bottom-0 mt-24 flex h-[85%] flex-col rounded-t-[10px]">
        <div className="container mt-2 flex flex-col gap-4">
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
        <div className="flex w-full flex-col justify-end gap-2 p-4">
          <ResetButton onClick={handleReset} />
          <Button onClick={handleSearchSubmit} className="whitespace-nowrap">
            {t("general.search")}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default SearchDrawer
