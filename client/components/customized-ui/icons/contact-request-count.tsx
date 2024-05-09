import React from "react"
import { useI18n } from "@/utils/services/internationalization/client"

import { Icons } from "@/components/icons"

interface IContactRequestCountProps {
  count: number
}
const ContactRequestCount: React.FunctionComponent<
  IContactRequestCountProps
> = ({ count }) => {
  const t = useI18n()
  return (
    <div className="space-x flex  flex-row items-center">
      <Icons.coffee />
      <p>{count}</p>
      <p>{t("general.chat", { count: count })}</p>
    </div>
  )
}

export default ContactRequestCount
