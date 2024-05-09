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
    <div className="flex flex-row items-center justify-center ">
      <Icons.coffee size={20} />
      <p>{t("general.chat", { count: count })}</p>
    </div>
  )
}

export default ContactRequestCount
