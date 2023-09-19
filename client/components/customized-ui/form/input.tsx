import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import React from "react"

import { Control } from "react-hook-form"

export interface IFormTextInputProps {
  control: Control<any>
  name: string
  label: string
  placeholder?: string
  description?: string
}

const FormTextInput: React.FunctionComponent<IFormTextInputProps> = ({
  control,
  name,
  label,
  placeholder,
  description,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormTextInput
