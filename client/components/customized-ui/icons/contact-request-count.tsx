import React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface IContactRequestCountProps {
  count: number
  className?: string
}
const ContactRequestCount: React.FunctionComponent<
  IContactRequestCountProps
> = ({ count, className }) => {
  return (
    <div className={cn("relative ", className)}>
      <Icons.coffee size={18} />
      {typeof count === "number" && count > 0 && (
        <p className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 rounded-full bg-indigo-500 px-1 text-[10px] text-white">
          {count}
        </p>
      )}
    </div>
  )
}

export default ContactRequestCount
