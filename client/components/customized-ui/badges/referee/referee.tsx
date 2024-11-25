import React from "react"
import { useI18n } from "@/utils/services/internationalization/client"

const RefereeBadge = () => {
  const t = useI18n()
  return (
    <div className="py flex items-center justify-center rounded-lg bg-teal-400 px-3 text-white">
      {t("user.type.referee")}
    </div>
  )
}

export default RefereeBadge
