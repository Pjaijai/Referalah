import React, { PropsWithChildren } from "react"

import { cn } from "@/lib/utils"
import useCreatedAt from "@/hooks/common/created-at"
import { Icons } from "@/components/icons"

// TODO: Remove
interface ICreatedAtDisplayProps {
  applyTo: "card" | "page"
  createdAt: string | null
  className?: string
}

const CreatedAtDisplay: React.FunctionComponent<
  PropsWithChildren<ICreatedAtDisplayProps>
> = ({ applyTo, createdAt, className }) => {
  const isCard = applyTo === "card"

  const { data: formattedCreatedAt } = useCreatedAt({ createdAt })

  return (
    <div className={cn("flex items-center justify-start space-x-1", className)}>
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
