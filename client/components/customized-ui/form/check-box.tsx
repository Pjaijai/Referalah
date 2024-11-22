import React from "react"
import { Control } from "react-hook-form"

import { Checkbox } from "@/components/ui/checkbox"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

interface ICheckBoxProps {
  control: Control<any>
  name: string
  label: string
  description?: string
  checkBoxClassName?: string
  labelClassName?: string
}

const FormCheckBox: React.FunctionComponent<ICheckBoxProps> = ({
  control,
  name,
  label,
  description,
  checkBoxClassName,
  labelClassName,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              className={checkBoxClassName}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className={labelClassName}>{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormCheckBox
