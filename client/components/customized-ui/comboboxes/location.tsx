"use client"

import React, { useState } from "react"
import {
  useCurrentLocale,
  useI18n,
} from "@/utils/services/internationalization/client"
import { useFormContext } from "react-hook-form"

import { TLocationData } from "@/types/api/response/location"
import { cn } from "@/lib/utils"
import useDebounce from "@/hooks/common/debounce"
import useLocationOptionsList from "@/hooks/common/options/location-options-list"
import { FormMessage } from "@/components/ui/form"
import BaseCombobox from "@/components/customized-ui/comboboxes/base"
import TextInput from "@/components/customized-ui/inputs/text"

interface LocationComboboxProps {
  locations: TLocationData[]
  inputClassName?: string
  optionsContainerClassName?: string
  isRequired?: boolean
}

const LocationCombobox: React.FC<LocationComboboxProps> = ({
  locations,
  inputClassName,
  optionsContainerClassName,
  isRequired,
}) => {
  const t = useI18n()
  const {
    watch,
    formState: { errors },
    setValue,
  } = useFormContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const locale = useCurrentLocale()
  const locationWatch = watch("location")

  const options = useLocationOptionsList(
    locations,
    false,
    locale,
    debouncedSearchTerm
  )

  // Determine the trigger title
  const triggerTitle = (options.find((option) => option.value === locationWatch)
    ?.label ?? t("general.please_select")) as string

  const handleOptionSelect = (uuid: string) => {
    setValue("location", uuid)

    setIsOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
  }

  // Always show TextInput and options when the popover is open
  const showOptions = isOpen

  return (
    <div className=" flex flex-col gap-2 ">
      <BaseCombobox
        triggerTitle={triggerTitle}
        popoverClassName="overflow-hidden max-h-[400px] "
        open={isOpen}
        onOpenChange={handleOpenChange}
        isRequired={isRequired}
        label={t("general.location")}
      >
        {showOptions && (
          <>
            <TextInput
              placeholder={t("general.search")}
              value={searchTerm}
              onChange={handleInputChange}
              inputClassName={cn("h-8 w-full", inputClassName)}
            />
            <div
              className={cn(
                "2-full mt-3 flex h-fit max-h-[250px] cursor-pointer flex-col overflow-y-scroll ",
                optionsContainerClassName
              )}
            >
              {options.length > 0 ? (
                options.map((option) => (
                  <div
                    key={option.value}
                    className="flex w-full flex-row items-center rounded-lg  p-2 text-slate-600 hover:bg-slate-100"
                    onClick={() => handleOptionSelect(option.value)}
                  >
                    {option.label}
                  </div>
                ))
              ) : (
                <div className="p-2 text-center text-gray-500">
                  {t("general.result_not_found")}
                </div>
              )}
            </div>
          </>
        )}
      </BaseCombobox>

      {errors.location && (
        <FormMessage>{errors.location.message?.toString()}</FormMessage>
      )}
    </div>
  )
}

export default LocationCombobox
