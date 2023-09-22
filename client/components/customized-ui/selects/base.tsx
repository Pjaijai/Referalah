import React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

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
      <SelectContent className="max-h-[300px]">
      <ScrollArea>
        {options &&
          options.map((option) => {
            return <SelectItem value={option.value}>{option.title}</SelectItem>
          })}
      </ScrollArea>
      </SelectContent>
    </Select>
  )
}

export default BaseSelect
