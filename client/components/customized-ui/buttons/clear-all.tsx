"use client"

import React from "react"
import { useI18n } from "@/utils/services/internationalization/client"

import { Button } from "@/components/ui/button"

interface IClearAllButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>
}
const ClearAllButton: React.FunctionComponent<IClearAllButtonProps> = ({
  onClick,
}) => {
  const t = useI18n()
  return (
    <Button
      onClick={onClick}
      variant={"base"}
      className="flex w-fit flex-row justify-end  p-0 text-indigo-600"
    >
      {t("general.clear_all")}
    </Button>
  )
}

export default ClearAllButton
