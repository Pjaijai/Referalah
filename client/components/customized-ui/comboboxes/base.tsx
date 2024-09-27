"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
}
const BaseCombobox: React.FunctionComponent<
  React.PropsWithChildren<IBaseComboboxProps>
> = ({ triggerTitle, children, popoverClassName }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-white"
        >
          {triggerTitle || "Select"}

          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("max-h-[300px] overflow-auto", popoverClassName)}
      >
        {children}
      </PopoverContent>
    </Popover>
  )
}

export default BaseCombobox
