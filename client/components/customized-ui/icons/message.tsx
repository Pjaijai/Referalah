import React from "react"

import { Icons } from "@/components/icons"

interface IMessageIconProps {
  showDot: boolean
  messageIconClassName?: string
}
const MessageIcon: React.FunctionComponent<IMessageIconProps> = ({
  showDot,
  messageIconClassName,
}) => {
  return (
    <div className="relative">
      <Icons.messageSquareMore className={messageIconClassName} />
      {showDot && (
        <Icons.bigDot
          className="absolute right-0 top-0 -translate-y-2 translate-x-2 text-green-700 dark:text-yellow-300"
          width="24"
          height="24"
        />
      )}
    </div>
  )
}

export default MessageIcon
