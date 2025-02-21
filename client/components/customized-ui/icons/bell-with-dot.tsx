import React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface IMessageIconProp {
  className?: string
  iconClassName?: string
  showDot: boolean
  onClick?: () => void
}
const BellIconWithDot: React.FunctionComponent<IMessageIconProp> = ({
  className,
  showDot,
  iconClassName,
  onClick,
}) => {
  return (
    <div className={cn("relative", className)}>
      <Icons.bell className={cn(iconClassName)} onClick={onClick} />
      {showDot && (
        <Icons.unseenDot
          size={30}
          className="h-30 w-30 absolute right-1 top-0"
        />
      )}
    </div>
  )
}

export default BellIconWithDot
