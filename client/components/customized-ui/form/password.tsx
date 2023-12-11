import React, { useState } from "react"

import { Button } from "@/components/ui/button"
import FormTextInput, {
  IFormTextInputProps,
} from "@/components/customized-ui/form/input"
import { Icons } from "@/components/icons"

interface IFormPasswordInputProps extends IFormTextInputProps {}
const FormPasswordInput: React.FunctionComponent<IFormPasswordInputProps> = ({
  control,
  label,
  name,
  description,
  placeholder,
  leftLabel,
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const handleClick = () => {
    setIsVisible((isVisible) => !isVisible)
  }

  const VisibleIcon = () => (
    <div className="cursor-pointer" onClick={handleClick}>
      {isVisible && <Icons.eye />}
      {!isVisible && <Icons.eyeOff />}
    </div>
  )
  return (
    <div className="relative">
      <FormTextInput
        control={control}
        label={label}
        name={name}
        description={description}
        placeholder={placeholder}
        type={isVisible ? "text" : "password"}
        leftLabel={leftLabel}
        Icon={<VisibleIcon />}
      />
    </div>
  )
}

export default FormPasswordInput
