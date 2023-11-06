import React from "react"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IFormTextInputProps } from "@/components/customized-ui/form/input"

interface IFormSelectProps extends IFormTextInputProps {
  options: { value: string; title: string }[]
  defaultValue?: string
}

const FormSelect: React.FunctionComponent<IFormSelectProps> = ({
  control,
  name,
  label,
  placeholder,
  description,
  options,
  defaultValue,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={defaultValue}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-[300px]">
              <ScrollArea>
                {options &&
                  options.length > 0 &&
                  options.map((option) => (
                    <SelectItem value={option.value} key={option.value}>
                      {option.title}
                    </SelectItem>
                  ))}
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
