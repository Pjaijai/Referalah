import React from "react"
import { useCurrentLocale } from "@/utils/services/internationalization/client"
import dayjs from "dayjs"
import { CalendarIcon } from "lucide-react"
import { Control } from "react-hook-form"

import { ELocale } from "@/types/common/enums/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface FormDatePickerProps {
  name: string
  label?: string
  description?: string
  disabledDates?: (date: Date) => boolean
  control: Control<any>
  buttonClassName?: string
  containerClassName?: string
  labelClassName?: string
  isRequired?: boolean
  descriptionClassName?: string
  errorMsg?: string
}

const FormDatePicker: React.FC<FormDatePickerProps> = ({
  name,
  label = "Date",
  disabledDates,
  control,
  buttonClassName,
  containerClassName,
  labelClassName,
  isRequired,
  description,
  descriptionClassName,
  errorMsg,
}) => {
  const locate = useCurrentLocale()
  const today = new Date()
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(containerClassName)}>
          <div className="flex w-full flex-row items-center justify-between">
            {label ? (
              <FormLabel className={cn(labelClassName)}>
                {label}
                {isRequired && <span className="text-rose-600">*</span>}
              </FormLabel>
            ) : null}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full bg-white pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground",
                    buttonClassName
                  )}
                >
                  {!field.value && <span>Pick a date</span>}
                  {locate === ELocale.ZH_HK && field.value
                    ? dayjs(field.value).format("YYYY年M月D日")
                    : dayjs(field.value).format("D MMM YYYY")}

                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={disabledDates}
                defaultMonth={field.value ? new Date(field.value) : today}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {description && (
            <FormDescription className={descriptionClassName}>
              {description}
            </FormDescription>
          )}

          <FormMessage message={errorMsg} />
        </FormItem>
      )}
    />
  )
}

export default FormDatePicker
