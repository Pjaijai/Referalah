import React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

type IFireIconProps = {
  isFire?: boolean
}
const FireIcon = ({ isFire }: IFireIconProps) => {
  return (
    <Icons.flame
      width={16}
      className={cn(
        isFire ? "fill-indigo-700  stroke-indigo-700" : "stroke-slate-700"
      )}
    />
  )
}

export default FireIcon
