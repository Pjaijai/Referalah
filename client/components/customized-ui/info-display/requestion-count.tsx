import React, { PropsWithChildren } from "react"
import { useI18n } from "@/utils/services/internationalization/client"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

// TODO: Remove
interface IRequestCountDisplayProps {
  count: number
  className?: string
}

const RequestCountDisplay: React.FunctionComponent<
  PropsWithChildren<IRequestCountDisplayProps>
> = ({ count, className }) => {
  const t = useI18n()
  return (
    <div className={cn("flex items-center justify-start", className)}>
      <div>
        <Icons.coffee width="18" height="18" />
      </div>
      <span className="ml-1">
        {t("general.chat", {
          count: count ?? 0,
        })}
      </span>
    </div>
  )
}

export default RequestCountDisplay
