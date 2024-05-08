"use client"

import React from "react"
import { useI18n } from "@/utils/services/internationalization/client"

import { Button } from "@/components/ui/button"

interface IResetButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>
}
const ResetButton: React.FunctionComponent<IResetButtonProps> = ({
  onClick,
}) => {
  const t = useI18n()
  return (
    <Button onClick={onClick} variant={"outline"} className="shrink-0">
      {t("general.reset")}
    </Button>
  )
}

export default ResetButton
