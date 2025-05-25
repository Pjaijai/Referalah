"use client"

import React, { useState } from "react"
import CompanyAvatar from "@/modules/job-journey/component/avatar/company"
import { useI18n } from "@/utils/services/internationalization/client"

import { cn } from "@/lib/utils"
import useSearchCompanyByName from "@/hooks/api/company/search-company-by-name"
import useDebounce from "@/hooks/common/debounce"
import BaseCombobox from "@/components/customized-ui/comboboxes/base"
import TextInput from "@/components/customized-ui/inputs/text"
import LoadingBalloonSpinner from "@/components/customized-ui/spinner/ball"

interface CompanyComboboxProps {
  onSelect: (name: string | null, id: number | null, reset: boolean) => void
  inputClassName?: string
  optionsContainerClassName?: string
  isRequired?: boolean
  company: {
    name: string
    id: number
  } | null
  className?: string
}

const CompanyCombobox: React.FC<CompanyComboboxProps> = ({
  optionsContainerClassName,
  inputClassName,
  company,
  onSelect,
  isRequired,
  className,
}) => {
  const t = useI18n()

  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const { data: options, isFetching } = useSearchCompanyByName({
    searchTerm: debouncedSearchTerm,
  })

  const triggerTitle = company ? company.name : t("general.all_companies")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.trim())
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
  }

  const handleOptionSelect = (companyId: number) => {
    const companyName = options!.find((option) => option.id === companyId)!.name

    onSelect(companyName, companyId, false)

    setIsOpen(false)
  }

  const handleResetClick = () => {
    onSelect(null, null, true)

    setIsOpen(false)
  }
  const showOptions = isOpen

  return (
    <div className={cn(" flex flex-col", className)}>
      <BaseCombobox
        triggerTitle={triggerTitle}
        popoverClassName="overflow-hidden max-h-[400px]"
        open={isOpen}
        onOpenChange={handleOpenChange}
        isRequired={isRequired}
        className="gap-0"
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
              {
                <div
                  onClick={handleResetClick}
                  className="flex flex-row items-center rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                >
                  {t("general.all_companies")}
                </div>
              }
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
                    <div>{option.name}</div>
                  </div>
                ))}
            </div>
          </>
        )}
      </BaseCombobox>
    </div>
  )
}

export default CompanyCombobox
