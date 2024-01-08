import React, { PropsWithChildren, useMemo } from "react"
import { formatCreatedAt } from "@/utils/common/helpers/format/created-at"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface ICreatedAtDisplayProps {
  applyTo: "card" | "page"
  createdAt: string | null
  className?: string
}

const CreatedAtDisplay: React.FunctionComponent<
  PropsWithChildren<ICreatedAtDisplayProps>
> = ({ applyTo, createdAt, className }) => {
  const isCard = applyTo === "card"

  const formattedCreatedAt = useMemo(() => {
    const { formattedDate, isExact } = formatCreatedAt(createdAt)
    return isCard || formattedDate === "--"
      ? formattedDate
      : `創建於${formattedDate}${isExact ? "" : "前"}`
  }, [createdAt])

  return (
    <div className={cn("flex items-center justify-start", className)}>
      {!isCard && (
        <div>
          <Icons.createdAt width="13" height="13" />
        </div>
      )}
      <span className="text-xs text-muted-foreground">
        {formattedCreatedAt}
      </span>
    </div>
  )
}

export default CreatedAtDisplay
