import { IFormTextInputProps } from "@/components/customized-ui/form/input";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import React from "react"

interface IFormSelectProps extends IFormTextInputProps {
  options: { value: string; title: string }[]
}
const FormSelect: React.FunctionComponent<IFormSelectProps> = ({
  control,
  name,
  label,
  placeholder,
  description,
  options,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-[300px]">
              <ScrollArea>
              {options?.length > 0 &&
                options.map((option) => {
                  return (
                    <SelectItem value={option.value}>{option.title}</SelectItem>
                  )
                })}
              </ScrollArea>
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormSelect
