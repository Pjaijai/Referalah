import React from "react"
import { useI18n } from "@/utils/services/internationalization/client"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface IContactRequestCountProps {
  count: number
  className?: string
}
const ContactRequestCount: React.FunctionComponent<
  IContactRequestCountProps
> = ({ count, className }) => {
  const t = useI18n()
  return (
    <div
      className={cn(
        "flex shrink-0 flex-row items-center justify-center gap-2 ",
        className
      )}
    >
      <Icons.coffee size={20} />

      <p>{t("general.chat", { count: count })}</p>
    </div>
  )
}

export default ContactRequestCount
