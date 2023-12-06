import React, { HTMLInputTypeAttribute } from "react"
import { Control } from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export interface IFormTextInputProps {
  control: Control<any>
  name: string
  label: string
  placeholder?: string
  description?: string
  leftLabel?: string | React.ReactNode
  type?: HTMLInputTypeAttribute
}

const FormTextInput: React.FunctionComponent<IFormTextInputProps> = ({
  control,
  name,
  label,
  placeholder,
  description,
  type,
  leftLabel,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex w-full flex-row items-center justify-between">
            <FormLabel>{label}</FormLabel>
            {leftLabel}
          </div>

          <FormControl>
            <Input placeholder={placeholder} type={type || "text"} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormTextInput
