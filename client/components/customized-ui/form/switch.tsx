import React from "react"
import { Control } from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"

interface FormSwitchProps {
  control: Control<any>
  name: string
  label?: string
  description?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

const FormSwitch: React.FC<FormSwitchProps> = ({
  control,
  name,
  label,
  description,
  checked,
  onCheckedChange,
  disabled = false,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <div className="space-y-0.5">
            {label && <FormLabel className="text-base">{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormControl>
            <Switch
              checked={checked}
              onCheckedChange={onCheckedChange}
              disabled={disabled}
              aria-readonly={disabled}
              variant="themePrimary"
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

export default FormSwitch
