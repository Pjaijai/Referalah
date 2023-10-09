import React from "react"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface IResetButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>
}
const ResetButton: React.FunctionComponent<IResetButtonProps> = ({
  onClick,
}) => {
  return (
    <Button onClick={onClick}>
      <Icons.instagram />
    </Button>
  )
}

export default ResetButton
