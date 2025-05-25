"use client"

import React, { useState } from "react"
import CompanyAvatar from "@/modules/job-journey/component/avatar/company"
import { useI18n } from "@/utils/services/internationalization/client"
import { useFormContext } from "react-hook-form"

import { cn } from "@/lib/utils"
import useSearchCompanyByName from "@/hooks/api/company/search-company-by-name"
import useDebounce from "@/hooks/common/debounce"
import { FormMessage } from "@/components/ui/form"
import BaseCombobox from "@/components/customized-ui/comboboxes/base"
import TextInput from "@/components/customized-ui/inputs/text"
import LoadingBalloonSpinner from "@/components/customized-ui/spinner/ball"

interface CompanyComboboxProps {
  inputClassName?: string
  optionsContainerClassName?: string
  isRequired?: boolean
}

const FormCompanyCombobox: React.FC<CompanyComboboxProps> = ({
  optionsContainerClassName,
  inputClassName,

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
  const companyWatch = watch("company")
  const newCompanyWatch = watch("newCompany")

  const { data: options, isFetching } = useSearchCompanyByName({
    searchTerm: debouncedSearchTerm,
  })

  const triggerTitle =
    companyWatch?.name ??
    (newCompanyWatch
      ? `${t("filter.combobox.company.create")} "${newCompanyWatch}" `
      : null) ??
    t("general.please_select")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.trim())
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
  }

  const handleOptionSelect = (companyId: number) => {
    const companyName = options!.find((option) => option.id === companyId)!.name

    // Update the form value for company
    setValue(
      "company",
      { id: companyId, name: companyName },
      { shouldValidate: true }
    )

    setValue("newCompany", null)

    setIsOpen(false)
  }

  const handleOptionCreate = () => {
    setValue("company", null)
    setValue("newCompany", searchTerm)

    setIsOpen(false)
  }

  // Always show TextInput and options when the popover is open
  const showOptions = isOpen
  const createOptionText = `${t(
    "filter.combobox.company.create"
  )} "${searchTerm}"`

  return (
    <div className="flex flex-col space-x-2">
      <BaseCombobox
        triggerTitle={triggerTitle}
        popoverClassName="overflow-hidden max-h-[400px]"
        open={isOpen}
        onOpenChange={handleOpenChange}
        isRequired={isRequired}
        label={t("general.company_name")}
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
                "font-base mt-3 flex h-fit max-h-[290px]  cursor-pointer flex-col gap-4 overflow-y-scroll px-2",
                optionsContainerClassName
              )}
            >
              {/* No input*/}

              {isFetching && (
                <div className="p-2 text-center text-gray-500">
                  <LoadingBalloonSpinner maxRandomBalls={3} />
                </div>
              )}

              {/* Have data */}
              {!isFetching &&
                options &&
                options.length > 0 &&
                options.map((option) => (
                  <div
                    key={option.id}
                    className="flex flex-row items-center gap-2 rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    <CompanyAvatar
                      url={option.meta_data?.logo_url ?? undefined}
                      alt={`${option.name} logo`}
                      className="h-6 w-6"
                      iconClassName="h-4 w-4"
                    />
                    <div className="text-slate-500">{option.name}</div>
                  </div>
                ))}

              {/* No data */}
              {!isFetching && options && options.length === 0 && (
                <>
                  <div onClick={handleOptionCreate}>{createOptionText}</div>
                </>
              )}
            </div>
          </>
        )}
      </BaseCombobox>

      {/* Display error for company field */}
      {errors.company && (
        <FormMessage>{errors.company.message?.toString()}</FormMessage>
      )}
    </div>
  )
}

export default FormCompanyCombobox
