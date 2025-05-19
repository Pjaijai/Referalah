import React from "react"
import { useI18n } from "@/utils/services/internationalization/client"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface ISelectOption {
  value: string
  label: string | React.ReactNode
}

interface IBaseSelectProps {
  triggerClassName?: string
  placeholder?: string
  options?: ISelectOption[]
  onChange: (e: any) => void
  defaultValue?: string
  value?: string
  isDisabled?: boolean
  itemClassName?: string
  showAllOption?: boolean
  allOptionLabel?: string
}

const BaseSelect: React.FunctionComponent<IBaseSelectProps> = ({
  triggerClassName,
  placeholder,
  options,
  onChange,
  defaultValue,
  value,
  isDisabled,
  itemClassName,
  showAllOption,
  allOptionLabel,
  ...props
}) => {
  const t = useI18n()
  return (
    <Select
      onValueChange={onChange}
      defaultValue={defaultValue}
      value={value}
      disabled={isDisabled}
      {...props}
    >
      <SelectTrigger className={cn("w-[180px]", triggerClassName)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        <ScrollArea>
          {showAllOption && (
            <SelectItem value={"all"} key={"all"} className={itemClassName}>
              {allOptionLabel ?? t("general.all")}
            </SelectItem>
          )}

          {options &&
            options.map((option) => (
              <SelectItem
                value={option.value}
                key={option.value}
                className={itemClassName}
              >
                {option.label}
              </SelectItem>
            ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  )
}

export default BaseSelect
