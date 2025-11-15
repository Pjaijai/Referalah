import React, { ChangeEvent } from "react"
import IndustryCombobox from "@/modules/post/components/comboboxes/industry"
import {
  useCurrentLocale,
  useI18n,
} from "@/utils/services/internationalization/client"

import { IIndustryResponse } from "@/types/api/response/industry"
import { TLocationData } from "@/types/api/response/location"
import { EMessageType } from "@/types/common/message-type"
import { cn } from "@/lib/utils"
import useLocationOptionsList from "@/hooks/common/options/location-options-list"
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
  locationList: TLocationData[]
  industryList: IIndustryResponse[]
  onLocationChange: (value: string) => void
  location: string
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
  location,
  onLocationChange,
  currentSorting,
  type,
  locationList,
  industryList,
  handleReset,
  bottomLeftSection,
  onKeyWordsChange,
  keywords,
  industries,
  onExperienceChange,
  experience,
}) => {
  const t = useI18n()
  const locale = useCurrentLocale()
  const { data: postSortingOptions } = usePostSortOptions()
  const { data: referralSortingOptions } = useReferralSortOptions()
  const locationOptions = useLocationOptionsList(locationList, false, locale)

  const currentLocationUuid =
    locationList.find((i) => i.value === location)?.uuid || "all"

  return (
    <div className=" mt-10">
      <div className="hidden flex-col justify-center gap-8 md:flex ">
        <div className="grid grid-cols-3 gap-2">
          <TextInput
            onChange={onKeyWordsChange}
            value={keywords}
            frontIcon={<Icons.search size={18} className="text-slate-400" />}
            inputClassName="bg-slate-100 placeholder:text-slate-400"
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
              {t("general.location")}
            </label>
            <div className="basis-3/4">
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
                triggerClassName="w-full border-0"
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
