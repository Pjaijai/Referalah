import React, { ChangeEvent } from "react"
import { postSortingOptions } from "@/utils/common/sorting/post"
import { referralSortingOptions } from "@/utils/common/sorting/referer"
import { useI18n } from "@/utils/services/internationalization/client"
import { Label } from "@radix-ui/react-label"

import { EMessageType } from "@/types/common/message-type"
import useCityOptions from "@/hooks/common/options/city-options"
import useCountryOptions from "@/hooks/common/options/country-options"
import useIndustryOptions from "@/hooks/common/options/industry-options"
import useProvinceOptions from "@/hooks/common/options/province-options"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import BaseSelect from "@/components/customized-ui/selects/base"
import { Icons } from "@/components/icons"

interface ISearchPopoverProps {
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
}

const SearchPopover: React.FunctionComponent<ISearchPopoverProps> = ({
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
}) => {
  const t = useI18n()
  const industryOptions = useIndustryOptions()
  const countryOptions = useCountryOptions()
  const provinceOptions = useProvinceOptions(countryUuid)
  const cityOptions = useCityOptions(provinceUuid)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Icons.slidersHorizontal />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-2">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label>{t("general.sorting")}</Label>
            <BaseSelect
              options={
                type === "referral"
                  ? referralSortingOptions
                  : postSortingOptions
              }
              onChange={onSortingChange}
              defaultValue={
                type === "referral"
                  ? referralSortingOptions[0].value
                  : postSortingOptions[0].value
              }
              value={currentSorting}
            />
          </div>

          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>{t("search.year_of_experience_label")}</Label>
              {/* <div className="grid grid-cols-3 items-center gap-4"> */}
              <Input
                type="number"
                onChange={onMinYearOfExperienceChange}
                value={currentMinYearOfExperience}
                placeholder={t("search.minimum_year_of_experience_label")}
              />

              <Input
                type="number"
                onChange={onMaxYearOfExperienceChange}
                value={currentMaxYearOfExperience}
                placeholder={t("search.maximum_year_of_experience_label")}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>{t("general.country")}</Label>
              <BaseSelect
                options={countryOptions}
                onChange={onCountryChange}
                value={currentCountryUuid}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>{t("general.province")}</Label>
              <BaseSelect
                options={provinceOptions}
                onChange={onProvinceChange}
                value={currentProvinceUuid}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>{t("general.city")}</Label>
              <BaseSelect
                options={cityOptions}
                onChange={onCityChange}
                value={currentCityUuid}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>{t("general.industry")}</Label>
              <BaseSelect
                options={industryOptions}
                onChange={onIndustryChange}
                value={currentIndustryUuid}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default SearchPopover
