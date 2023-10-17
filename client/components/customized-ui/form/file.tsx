import React from "react"

import { FormControl, FormDescription, FormLabel } from "@/components/ui/form"
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
    <div className="w-full flex-col">
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
    </div>
  )
}

export default FormFileUpload
