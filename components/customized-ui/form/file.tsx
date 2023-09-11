import React from "react"
import { Control } from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface IInputFormFieldProps {
  label: string
  placeholder?: string
  description?: string
  onChange: (e: any) => void
  accept: string
}

const FormFileUpload: React.FunctionComponent<IInputFormFieldProps> = ({
  label,
  placeholder,
  description,
  onChange,
  accept,
}) => {
  return (
    <>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input
          placeholder={placeholder}
          type="file"
          accept={accept}
          onChange={onChange}
        />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
    </>
  )
}

export default FormFileUpload
