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
  control?: Control<any>
  name: string
  label: string
  placeholder?: string
  description?: string
  onChange: (e: any) => void
}

const InputFileField: React.FunctionComponent<IInputFormFieldProps> = ({
  control,
  name,
  label,
  placeholder,
  description,
  onChange,
}) => {
  return (
    // <FormField
    //   control={control}
    //   name={name}
    //   render={({ field }) => (
    //     <FormItem>
    //       <FormLabel>{label}</FormLabel>
    //       <FormControl>
    //         <Input
    //           placeholder={placeholder}
    //           type="file"
    //           accept=".jpg, .jpeg, .png"
    //           {...field}
    //         />
    //       </FormControl>
    //       {description && <FormDescription>{description}</FormDescription>}
    //       <FormMessage />
    //     </FormItem>
    //   )}
    // />

    <>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input
          placeholder={placeholder}
          type="file"
          accept=".jpg, .jpeg, .png"
          onChange={onChange}
        />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
    </>
  )
}

export default InputFileField
