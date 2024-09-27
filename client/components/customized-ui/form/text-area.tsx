import React, { useEffect, useRef } from "react"
import { UseFormReturn } from "react-hook-form"

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
  control: UseFormReturn<any>["control"]
}

const FormTextArea: React.FunctionComponent<IFormTextArea> = ({
  control,
  name,
  label,
  placeholder,
  description,
  inputClassName,
  minRows = 3,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const adjustHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  useEffect(() => {
    adjustHeight()
  }, [])

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className={`${inputClassName} overflow-hidden`}
              {...field}
              ref={(e) => {
                textareaRef.current = e
                if (typeof field.ref === "function") {
                  field.ref(e)
                } else if (field.ref && "current" in field.ref) {
                  ;(
                    field.ref as React.MutableRefObject<HTMLTextAreaElement | null>
                  ).current = e
                }
              }}
              rows={minRows}
              onChange={(e) => {
                field.onChange(e)
                adjustHeight()
              }}
              style={{ resize: "none" }}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormTextArea
