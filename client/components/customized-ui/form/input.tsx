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
  type?: HTMLInputTypeAttribute
}

const FormTextInput: React.FunctionComponent<IFormTextInputProps> = ({
  control,
  name,
  label,
  placeholder,
  description,
  type,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
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
