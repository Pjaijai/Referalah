import React, { PropsWithChildren } from "react"
import { formatCreatedAt } from "@/utils/common/helpers/format/createdAt"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface ICreatedAtDisplayProps {
  createdAt: string | null
  className?: string
}

const CreatedAtDisplay: React.FunctionComponent<
  PropsWithChildren<ICreatedAtDisplayProps>
> = ({ createdAt, className }) => {
  const formattedCreatedAt = formatCreatedAt(createdAt)
  return (
    <div className={cn("flex items-center justify-start", className)}>
      <div>
        <Icons.createdAt width="13" height="13" />
      </div>
      <span className="ml-1">
        創建於{formattedCreatedAt}
        {formattedCreatedAt !== "今日" && "前"}
      </span>
    </div>
  )
}

export default CreatedAtDisplay
