import React, { useState } from "react"
import { useI18n } from "@/utils/services/internationalization/client"
import { CheckedState } from "@radix-ui/react-checkbox"

import { IIndustryResponse } from "@/types/api/response/industry"
import { cn } from "@/lib/utils"
import useIndustryFilterOptions from "@/hooks/common/options/industry-options-filter"
import { Checkbox } from "@/components/ui/checkbox"
import { IComboboxOption } from "@/components/customized-ui/comboboxes/base"
import TextInput from "@/components/customized-ui/inputs/text"

interface IIndustrySelectProps {
  industryList: IIndustryResponse[]
  industries: Set<string>
  onIndustryChange: (value: string[]) => void
  containerClassName?: string
  optionsContainerClassName?: string
  inputClassName?: string
}

const IndustrySelect: React.FunctionComponent<IIndustrySelectProps> = ({
  industryList,
  industries,
  onIndustryChange,
  containerClassName,
  optionsContainerClassName,
  inputClassName,
}) => {
  const t = useI18n()
  const [searchTerm, setSearchTerm] = useState("")

  const options: IComboboxOption[] = useIndustryFilterOptions(
    industryList,
    searchTerm
  )

  const selectedAllValue = options.every((o) => industries.has(o.value))

  const handleClick = (_checkStatus: CheckedState, value: string) => {
    const isPreviouslySelected = industries.has(value)

    if (isPreviouslySelected) {
      industries.delete(value)
      const updatedIndustries = Array.from(industries)

      if (!updatedIndustries.length) return
      onIndustryChange(updatedIndustries)
      return
    }

    if (!isPreviouslySelected) {
      const updatedLocations = [value, ...Array.from(industries)]
      onIndustryChange(updatedLocations)
      return
    }
  }

  const handleBulkClick = () => {
    if (selectedAllValue) {
      onIndustryChange([])
    } else {
      const uuids = options.map((option) => option.value)
      onIndustryChange(uuids)
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
              checked={options.every((option) => industries.has(option.value))}
              onCheckedChange={handleBulkClick}
            />
            <span className=" text-slate-600">{t("general.all")}</span>
          </div>
        )}

        {options.map((option) => (
          <div key={option.value} className="flex flex-row items-center">
            <Checkbox
              className={cn("mr-2 h-4 w-4 ")}
              checked={industries.has(option.value)}
              onCheckedChange={(status) => handleClick(status, option.value)}
            />
            <span className=" text-slate-600">{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default IndustrySelect
