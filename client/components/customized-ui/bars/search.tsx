import React, { ChangeEvent } from "react"
import IndustryCombobox from "@/modules/post/components/comboboxes/industry"
import LocationCombobox from "@/modules/post/components/comboboxes/location"
import { useI18n } from "@/utils/services/internationalization/client"

import { ICityResponse } from "@/types/api/response/city"
import { ICountryResponse } from "@/types/api/response/country"
import { IIndustryResponse } from "@/types/api/response/industry"
import { IProvinceResponse } from "@/types/api/response/province"
import { EMessageType } from "@/types/common/message-type"
import { cn } from "@/lib/utils"
import usePostSortOptions from "@/hooks/common/sort/post-sort-options"
import useReferralSortOptions from "@/hooks/common/sort/referral-sort-options"
import ClearAllButton from "@/components/customized-ui/buttons/clear-all"
import TextInput from "@/components/customized-ui/inputs/text"
import BaseSelect from "@/components/customized-ui/selects/base"
import YearOfExperienceSlider from "@/components/customized-ui/sliders/year-of-experience"
import { Icons } from "@/components/icons"

export interface ISearchSearchBarProps {
  onKeyWordsChange: (e: ChangeEvent<HTMLInputElement>) => void
  onIndustryChange: (value: string[]) => void
  onSortingChange: (value: string) => void
  currentSorting: string
  type: EMessageType
  countryList: ICountryResponse[]
  provinceList: IProvinceResponse[]
  cityList: ICityResponse[]
  industryList: IIndustryResponse[]
  onLocationChange: (value: string[]) => void
  locations: Set<string>
  industries: Set<string>
  keywords: string
  handleReset: () => void
  bottomLeftSection?: React.ReactNode
  experience: number
  onExperienceChange: (value: number) => void
}

const SearchBar: React.FunctionComponent<ISearchSearchBarProps> = ({
  onIndustryChange,
  onSortingChange,
  locations,
  onLocationChange,
  currentSorting,
  type,
  cityList,
  countryList,
  industryList,
  provinceList,
  handleReset,
  bottomLeftSection,
  onKeyWordsChange,
  keywords,
  industries,
  onExperienceChange,
  experience,
}) => {
  const t = useI18n()
  const { data: postSortingOptions } = usePostSortOptions()
  const { data: referralSortingOptions } = useReferralSortOptions()

  return (
    <div className="md:mt-2 ">
      <div className="hidden flex-col justify-center gap-8 md:flex ">
        <div className="grid grid-cols-3 gap-2">
          <TextInput
            onChange={onKeyWordsChange}
            value={keywords}
            frontIcon={<Icons.search size={18} className="text-slate-400" />}
            inputClassName="bg-slate-100"
            placeholder={t("search.keywords.placeholder")}
          />
          <div className="flex flex-row items-center justify-between">
            <label className="basis-1/4 text-center text-sm">
              {t("general.industry")}
            </label>
            <div className="basis-3/4">
              <IndustryCombobox
                industries={industries}
                industryList={industryList}
                onIndustryChange={onIndustryChange}
              />
            </div>
          </div>

          <div className="flex flex-row items-center justify-between">
            <label className="basis-1/4 text-center text-sm">
              {t("general.region")}
            </label>
            <div className="basis-3/4">
              <LocationCombobox
                cityList={cityList}
                countryList={countryList}
                provinceList={provinceList}
                locations={locations}
                onLocationChange={onLocationChange}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="grid grid-cols-5 items-center gap-4">
            <label className="col-span-1 text-left text-sm text-slate-500">
              {t("general.sorting")}
            </label>
            <div className="col-span-3 col-start-2">
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
                placeholder={t("general.sorting")}
                triggerClassName="w-full"
              />
            </div>
          </div>

          <div className="flex flex-row items-center justify-between">
            <label className="basis-1/4 text-center text-sm">
              {t("general.year_of_experience")}
            </label>
            <div className="basis-3/4">
              <YearOfExperienceSlider
                value={[experience]}
                onChange={onExperienceChange}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <ClearAllButton onClick={handleReset} />
          </div>
        </div>
      </div>
      <div
        className={cn(
          "flex w-full flex-row md:mt-4",
          bottomLeftSection ? "justify-between " : "justify-end"
        )}
      >
        {bottomLeftSection}
      </div>
    </div>
  )
}

export default SearchBar
