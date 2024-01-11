import React from "react"

import { Icons } from "@/components/icons"

export interface IBellIconProps {
  showDot: boolean
}
const BellIcon: React.FunctionComponent<IBellIconProps> = ({ showDot }) => {
  return (
    <div className="relative">
      <Icons.bell />
      {true && (
        <Icons.bigDot
          className="absolute right-0 top-0 -translate-y-2 translate-x-2 text-green-700 dark:text-yellow-300"
          width="22"
          height="22"
        />
      )}
    </div>
  )
}

export default BellIcon
