import React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface IContactRequestCountProps {
  count: number
  className?: string
  status?: "active" | "inactive"
}
const ContactRequestCount: React.FunctionComponent<
  IContactRequestCountProps
> = ({ count, className, status = "inactive" }) => {
  const isActive = status == "active"
  return (
    <div
      className={cn(
        "relative text-indigo-600",
        !isActive && "opacity-30",
        className
      )}
    >
      <Icons.coffee size={18} />

      <p className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 rounded-full bg-indigo-600 px-1 text-[10px] text-white">
        {count || "-"}
      </p>
    </div>
  )
}

export default ContactRequestCount
