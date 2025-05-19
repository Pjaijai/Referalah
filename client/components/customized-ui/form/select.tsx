import React from "react"
import { useI18n } from "@/utils/services/internationalization/client"

import { cn } from "@/lib/utils"
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
import { ISelectOption } from "@/components/customized-ui/selects/base"

interface IFormSelectProps extends IFormTextInputProps {
  options: ISelectOption[]
  defaultValue?: string
  isDisabled?: boolean
  triggerClassName?: string
  itemClassName?: string
  labelClassName?: string
  containerClassName?: string
  isRequired?: boolean
}

const FormSelect: React.FunctionComponent<IFormSelectProps> = ({
  control,
  name,
  label,
  placeholder,
  description,
  options,
  defaultValue,
  isDisabled,
  triggerClassName,
  itemClassName,
  labelClassName,
  containerClassName,
  isRequired,
}) => {
  const t = useI18n()
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(containerClassName)}>
          <div className="flex w-full flex-row items-center justify-between">
            {label ? (
              <FormLabel className={labelClassName}>
                {label}
                {isRequired && <span className="text-rose-600">*</span>}
              </FormLabel>
            ) : null}
          </div>
          <Select
            onValueChange={field.onChange}
            defaultValue={defaultValue}
            value={field.value}
            disabled={isDisabled}
          >
            <FormControl>
              <SelectTrigger className={cn(triggerClassName)}>
                {field.value ? (
                  <SelectValue />
                ) : (
                  placeholder ?? t("general.please_select")
                )}
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-[300px]">
              <ScrollArea>
                {options &&
                  options.length > 0 &&
                  options.map((option) => (
                    <SelectItem
                      value={option.value}
                      key={option.value}
                      className={cn(itemClassName)}
                    >
                      {option.label}
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
