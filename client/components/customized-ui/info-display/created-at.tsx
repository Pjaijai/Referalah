import React, { PropsWithChildren } from "react"
import { formatCreatedAt } from "@/utils/common/helpers/format/date"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface ICreatedAtDisplayProps {
  createdAt: string
  className?: string
}

const CreatedAtDisplay: React.FunctionComponent<
  PropsWithChildren<ICreatedAtDisplayProps>
> = ({ createdAt, className }) => {
  return (
    <div className={cn("flex items-center justify-start", className)}>
      <div>
        <Icons.createdAt width="13" height="13" />
      </div>
      <span className="ml-1">創建於{formatCreatedAt(createdAt)}前</span>
    </div>
  )
}

export default CreatedAtDisplay
