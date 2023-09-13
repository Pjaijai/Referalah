import React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface INumberInputProps {
  label?: string
  placeholder?: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  id?: string
  value?: string
}

const NumberInput: React.FunctionComponent<INumberInputProps> = ({
  label,
  placeholder,
  id,
  onChange,
  value,
}) => {
  return (
    <div className="flex flex-col w-ful">
      {label && <Label htmlFor={id}>{label}</Label>}

      <Input
        type="number"
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  )
}
export default NumberInput
