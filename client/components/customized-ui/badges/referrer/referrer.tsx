import React from "react"
import { useI18n } from "@/utils/services/internationalization/client"

const ReferrerBadge = () => {
  const t = useI18n()
  return (
    <div className="py flex shrink-0 items-center justify-center rounded-lg bg-orange-400 px-3 text-white">
      {t("user.type.referrer")}
    </div>
  )
}

export default ReferrerBadge
