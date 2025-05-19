"use client"

import * as React from "react"
import { useI18n } from "@/utils/services/internationalization/client"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FormLabel } from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface IComboboxOption {
  value: string
  label: string
}

interface IBaseComboboxProps {
  triggerTitle?: string
  popoverClassName?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  isRequired?: boolean
  label?: string
  className?: string
}

const BaseCombobox: React.FC<React.PropsWithChildren<IBaseComboboxProps>> = ({
  triggerTitle,
  children,
  popoverClassName,
  open,
  onOpenChange,
  isRequired,
  label,
  className,
}) => {
  const t = useI18n()
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex w-full flex-row items-center justify-between">
        {label ? (
          <FormLabel>
            {label}
            {isRequired && <span className="text-rose-600">*</span>}
          </FormLabel>
        ) : null}
      </div>

      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild className={cn(label && "mt-2")}>
          <Button
            variant="base"
            role="combobox"
            aria-expanded={open}
            className=" w-full justify-between border border-input bg-white"
          >
            {triggerTitle || t("general.please_select")}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn("max-h-[300px]  overflow-y-auto", popoverClassName)}
        >
          {children}
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default BaseCombobox
