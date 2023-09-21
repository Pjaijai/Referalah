import { IFormTextInputProps } from "@/components/customized-ui/form/input"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import React from "react"

interface IFormTextArea extends IFormTextInputProps {}
const FormTextArea: React.FunctionComponent<IFormTextArea> = ({
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
            <Textarea placeholder={placeholder} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormTextArea
