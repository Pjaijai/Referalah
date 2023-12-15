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
}

const TextInput: React.FunctionComponent<ITextInputProps> = ({
  label,
  placeholder,
  id,
  onChange,
  value,
  disabled,
}) => {
  return (
    <div className="w-ful flex flex-col gap-2">
      {label && (
        <Label htmlFor={id} className={cn(disabled && "text-muted-foreground")}>
          {label}
        </Label>
      )}

      <Input
        type="text"
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  )
}
export default TextInput
