import React, { useCallback, useEffect, useRef } from "react"
import { UseFormReturn } from "react-hook-form"

import { cn } from "@/lib/utils"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { IFormTextInputProps } from "@/components/customized-ui/form/input"

interface IFormTextArea extends Omit<IFormTextInputProps, "control"> {
  inputClassName?: string
  minRows?: number
  maxLength?: number
  control: UseFormReturn<any>["control"]
  labelClassName?: string
  isDisabled?: boolean
}

const FormTextArea: React.FunctionComponent<IFormTextArea> = ({
  control,
  name,
  label,
  placeholder,
  description,
  inputClassName,
  minRows = 3,
  maxLength,
  labelClassName,
  isDisabled,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      if (textarea.value.trim() === "") {
        textarea.style.height = `${minRows * 24}px`
      } else {
        textarea.style.height = "auto"
        textarea.style.height = `${textarea.scrollHeight}px`
      }
    }
  }, [minRows])

  useEffect(() => {
    adjustHeight()
    return () => {
      adjustHeight()
    }
  }, [adjustHeight])

  const getCharacterCount = () => {
    const textarea = textareaRef.current
    return textarea ? textarea.value.length : 0
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="relative">
          <FormLabel className={cn("text-slate-500", labelClassName)}>
            {label}
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className={`${inputClassName}`}
              {...field}
              ref={(e) => {
                field.ref(e)
                textareaRef.current = e
              }}
              rows={minRows}
              maxLength={maxLength}
              onChange={(e) => {
                field.onChange(e)
                setTimeout(() => {
                  adjustHeight()
                }, 0)
              }}
              style={{ resize: "none" }}
              disabled={isDisabled}
            />
          </FormControl>
          {maxLength !== undefined && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {getCharacterCount()} / {maxLength}
            </div>
          )}
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormTextArea
