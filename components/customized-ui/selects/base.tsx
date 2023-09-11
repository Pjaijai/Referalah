import React from "react"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface ISelectOption {
  value: string
  title: string
}
interface IBaseSelectProps {
  triggerClassName?: string
  placeholder?: string
  options?: ISelectOption[]
  onChange: (e: string) => void
  defaultValue?: string
  value?: string
}
const BaseSelect: React.FunctionComponent<IBaseSelectProps> = ({
  triggerClassName,
  placeholder,
  options,
  onChange,
  defaultValue,
  value,
}) => {
  return (
    <Select onValueChange={onChange} defaultValue={defaultValue} value={value}>
      <SelectTrigger className={cn("w-[180px]", triggerClassName)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options &&
          options.map((option) => {
            return <SelectItem value={option.value}>{option.title}</SelectItem>
          })}
      </SelectContent>
    </Select>
  )
}

export default BaseSelect