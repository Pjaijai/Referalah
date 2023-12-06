import React from "react"

import FormTextInput, {
  IFormTextInputProps,
} from "@/components/customized-ui/form/input"

interface IFormPasswordInputProps extends IFormTextInputProps {}
const FormPasswordInput: React.FunctionComponent<IFormPasswordInputProps> = ({
  control,
  label,
  name,
  description,
  placeholder,
  leftLabel,
}) => {
  return (
    <FormTextInput
      control={control}
      label={label}
      name={name}
      description={description}
      placeholder={placeholder}
      type="password"
      leftLabel={leftLabel}
    />
  )
}

export default FormPasswordInput
