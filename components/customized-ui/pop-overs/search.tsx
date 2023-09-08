import React, { ChangeEvent, ChangeEventHandler, useState } from "react"
import { refererSortingOptions } from "@/utils/common/sorting/referer"
import { Label } from "@radix-ui/react-label"

import { ICityResponse } from "@/types/api/response/city"
import { ICountryResponse } from "@/types/api/response/country"
import { IIndustryResponse } from "@/types/api/response/industry"
import { IProvinceResponse } from "@/types/api/response/province"
import useCityOptions from "@/hooks/common/options/useCityOptions"
import useCountryOptions from "@/hooks/common/options/useCountryOptions"
import useIndustryOptions from "@/hooks/common/options/useIndustryOptions"
import useProvinceOptions from "@/hooks/common/options/useProvinceOptions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Select } from "@/components/ui/select"
import BaseSelect, {
  ISelectOption,
} from "@/components/customized-ui/select/base"
import { Icons } from "@/components/icons"

// TODO
// couuntry
// city
// province
//induestry
// year from x to x
// sort by yeo
interface ISearchPopoverProps {
  countryList: ICountryResponse[]
  provinceList: IProvinceResponse[]
  cityList: ICityResponse[]
  industryList: IIndustryResponse[]
  countryUuid?: string
  provinceUuid?: string
  onCountryChange: (value: string) => void
  onProvinceChange: (value: string) => void
  onCityChange: (value: string) => void
  onIndustryChange: (value: string) => void
  onSortingChange: (value: string) => void
  onYeoMinChange: (e: ChangeEvent<HTMLInputElement>) => void
  onYeoMaxChange: (e: ChangeEvent<HTMLInputElement>) => void
}
const SearchPopover: React.FunctionComponent<ISearchPopoverProps> = ({
  countryList,
  provinceList,
  cityList,
  industryList,
  provinceUuid,
  countryUuid,
  onCityChange,
  onCountryChange,
  onProvinceChange,
  onIndustryChange,
  onSortingChange,
  onYeoMinChange,
  onYeoMaxChange,
}) => {
  const industryOptions = useIndustryOptions(industryList)
  const countryOptions = useCountryOptions(countryList)
  const provinceOptions = useProvinceOptions(provinceList, countryUuid)
  const cityOptions = useCityOptions(cityList, provinceUuid)

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
            <BaseSelect
              options={refererSortingOptions}
              onChange={onSortingChange}
              defaultValue={refererSortingOptions[0].value}
            />
            <Button>reset</Button>
          </div>

          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>Country</Label>
              <Input type="number" onChange={onYeoMinChange} /> <span>to</span>{" "}
              <Input type="number" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>Country</Label>
              <BaseSelect options={countryOptions} onChange={onCountryChange} />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>Province</Label>
              <BaseSelect
                options={provinceOptions}
                onChange={onProvinceChange}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>City</Label>
              <BaseSelect options={cityOptions} onChange={onCityChange} />
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Label>indtry</Label>
              <BaseSelect
                options={industryOptions}
                onChange={onIndustryChange}
              />
            </div>
            {/* <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxHeight">Max. height</Label>
              <BaseSelect />
            </div> */}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default SearchPopover
