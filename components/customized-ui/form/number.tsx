import React from "react"
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
import { IFormTextInputProps } from "@/components/customized-ui/form/input"

export interface IFormNumberInputProps extends IFormTextInputProps {}

const FormNumberInput: React.FunctionComponent<IFormNumberInputProps> = ({
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
            <Input placeholder={placeholder} type="number" {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormNumberInput
