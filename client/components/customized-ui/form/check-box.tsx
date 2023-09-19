import { Checkbox } from "@/components/ui/checkbox"
import { FormField, FormItem, FormControl, FormLabel, FormDescription } from "@/components/ui/form"

import React from "react"

import { Control } from "react-hook-form"

interface ICheckBoxProps {
  control: Control<any>
  name: string
  label: string
  description?: string
}

const FormCheckBox: React.FunctionComponent<ICheckBoxProps> = ({
  control,
  name,
  label,
  description,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
        </FormItem>
      )}
    />
  )
}

export default FormCheckBox
