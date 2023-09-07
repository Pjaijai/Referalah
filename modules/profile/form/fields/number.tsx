import React from "react"
import { IFormTextInputFieldProps } from "@/modules/profile/form/fields/input"
import { Control, FieldValues } from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export interface IFormNumberInputFieldProps extends IFormTextInputFieldProps {}

const FormNumberInputField: React.FunctionComponent<
  IFormNumberInputFieldProps
> = ({ control, name, label, placeholder, description }) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} type="number" {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormNumberInputField
