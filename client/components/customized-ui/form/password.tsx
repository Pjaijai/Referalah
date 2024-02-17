import React, { useState } from "react"

import FormTextInput, {
  IFormTextInputProps,
} from "@/components/customized-ui/form/input"
import { Icons } from "@/components/icons"

interface IFormPasswordInputProps extends IFormTextInputProps {
  value: string
}
const FormPasswordInput: React.FunctionComponent<IFormPasswordInputProps> = ({
  control,
  label,
  name,
  description,
  placeholder,
  leftLabel,
  value,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [showIcon, setShowIcon] = useState(false)

  const handleClick = () => {
    setIsVisible((isVisible) => !isVisible)
  }

  const VisibleIcon = () => (
    <div className="cursor-pointer" onClick={handleClick}>
      {isVisible && <Icons.eye />}
      {!isVisible && <Icons.eyeOff />}
    </div>
  )

  const handleFocus = () => {
    setShowIcon(true)
  }

  const handleBlur = () => {
    if (!value) {
      setShowIcon(false)
    }
  }
  return (
    <div className="relative">
      <FormTextInput
        onFocus={handleFocus}
        onBlur={handleBlur}
        control={control}
        label={label}
        name={name}
        description={description}
        placeholder={placeholder}
        type={isVisible ? "text" : "password"}
        leftLabel={leftLabel}
        Icon={showIcon ? <VisibleIcon /> : null}
      />
    </div>
  )
}

export default FormPasswordInput
