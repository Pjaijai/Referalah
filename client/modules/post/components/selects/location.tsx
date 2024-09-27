import React, { useState } from "react"
import { useI18n } from "@/utils/services/internationalization/client"
import { CheckedState } from "@radix-ui/react-checkbox"

import { ICityResponse } from "@/types/api/response/city"
import { ICountryResponse } from "@/types/api/response/country"
import { IProvinceResponse } from "@/types/api/response/province"
import { cn } from "@/lib/utils"
import useLocationOptions from "@/hooks/common/options/location-options"
import { Checkbox } from "@/components/ui/checkbox"
import { IComboboxOption } from "@/components/customized-ui/comboboxes/base"
import TextInput from "@/components/customized-ui/inputs/text"

interface ILocationSelectProps {
  countryList: ICountryResponse[]
  provinceList: IProvinceResponse[]
  cityList: ICityResponse[]
  locations: Set<string>
  onLocationChange: (value: string[]) => void
  containerClassName?: string
  optionsContainerClassName?: string
  inputClassName?: string
}

const LocationSelect: React.FunctionComponent<ILocationSelectProps> = ({
  countryList,
  provinceList,
  cityList,
  locations,
  onLocationChange,
  containerClassName,
  optionsContainerClassName,
  inputClassName,
}) => {
  const t = useI18n()
  const [searchTerm, setSearchTerm] = useState("")
  const options: IComboboxOption[] = useLocationOptions(
    countryList,
    provinceList,
    cityList,
    searchTerm
  )
  const selectedAllValue = options.every((o) => locations.has(o.value))

  const handleClick = (_checkStatus: CheckedState, value: string) => {
    const isPreviouslySelected = locations.has(value)

    if (isPreviouslySelected) {
      locations.delete(value)
      const updatedLocations = Array.from(locations)

      if (!updatedLocations.length) return

      onLocationChange(updatedLocations)
      return
    }

    if (!isPreviouslySelected) {
      const updatedLocations = [value, ...Array.from(locations)]
      onLocationChange(updatedLocations)
      return
    }
  }

  const handleBulkClick = () => {
    if (selectedAllValue) {
      onLocationChange([])
    } else {
      const uuids = options.map((option) => option.value)
      onLocationChange(uuids)
    }
  }
  return (
    <div className={cn(containerClassName)}>
      <TextInput
        placeholder={t("general.search")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        inputClassName={cn("h-8 w-full", inputClassName)}
      />
      <div
        className={cn(
          "mt-3 flex max-h-[220px] flex-col gap-4 overflow-y-scroll px-2",
          optionsContainerClassName
        )}
      >
        {!searchTerm && (
          <div className="flex flex-row items-center ">
            <Checkbox
              className={cn("mr-2 h-4 w-4 ")}
              checked={options.every((option) => locations.has(option.value))}
              onCheckedChange={handleBulkClick}
            />
            <span className=" text-slate-600">{t("general.all")}</span>
          </div>
        )}

        {options.map((option) => (
          <div key={option.value} className="flex flex-row items-center ">
            <Checkbox
              className={cn("mr-2 h-4 w-4 ")}
              checked={locations.has(option.value)}
              onCheckedChange={(status) => handleClick(status, option.value)}
            />
            <span className=" text-slate-600">{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LocationSelect
