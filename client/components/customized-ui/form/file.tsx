import React from "react"

import { cn } from "@/lib/utils"
import { FormControl, FormDescription, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface IInputFormFieldProps {
  label?: string
  placeholder?: string
  description?: string
  onChange: (e: any) => void
  accept: string
  className?: string
}

const FormFileUpload: React.FunctionComponent<IInputFormFieldProps> = ({
  label,
  placeholder,
  description,
  onChange,
  accept,
  className,
}) => {
  return (
    <div className={cn("w-full flex-col", className)}>
      {label && <FormLabel>{label}</FormLabel>}

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
