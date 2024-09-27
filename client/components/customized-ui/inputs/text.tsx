import React from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ITextInputProps {
  label?: string
  placeholder?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  id?: string
  value?: string
  disabled?: boolean
  className?: string
  inputClassName?: string
  frontIcon?: React.ReactNode
}

const TextInput: React.FunctionComponent<ITextInputProps> = ({
  label,
  placeholder,
  id,
  onChange,
  value,
  disabled,
  className,
  inputClassName,
  frontIcon,
}) => {
  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {label && (
        <Label htmlFor={id} className={cn(disabled && "text-muted-foreground")}>
          {label}
        </Label>
      )}
      <div className="relative flex items-center">
        {frontIcon && <span className="absolute left-3">{frontIcon}</span>}
        <Input
          type="text"
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          className={cn(frontIcon && "pl-10", inputClassName)}
        />
      </div>
    </div>
  )
}
export default TextInput
