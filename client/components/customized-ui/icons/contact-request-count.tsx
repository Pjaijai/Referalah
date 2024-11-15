import React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface IContactRequestCountIconProps {
  count: number
  className?: string
  status?: "active" | "inactive"
  size?: "small" | "medium"
}

const ContactRequestCountIcon: React.FunctionComponent<
  IContactRequestCountIconProps
> = ({ count, className, status = "inactive", size = "small" }) => {
  const isActive = status == "active"
  const digitCount = count ? count.toString().length : 1

  const getCircleSize = (size: "small" | "medium", digitCount: number) => {
    if (size === "small") {
      return digitCount === 1
        ? "w-5 h-5"
        : digitCount === 2
        ? "w-6 h-6"
        : "w-7 h-7"
    } else {
      return digitCount === 1
        ? "w-6 h-6"
        : digitCount === 2
        ? "w-8 h-8"
        : "w-8 h-8"
    }
  }

  const getFontSize = (size: "small" | "medium", digitCount: number) => {
    if (size === "small") {
      return digitCount === 1 ? "text-[13px]" : "text-[12px]"
    } else {
      return digitCount === 1
        ? "text-[16px]"
        : digitCount === 2
        ? "text-[14px]"
        : "text-[13px]"
    }
  }

  return (
    <div
      className={cn(
        "relative text-indigo-600",
        !isActive && "opacity-30",
        className
      )}
    >
      <Icons.coffee size={size === "small" ? 18 : 34} />

      <p
        className={cn(
          "absolute right-0 top-0 flex items-center justify-center rounded-full bg-indigo-600 text-white",
          size === "small"
            ? "-translate-y-1/2 translate-x-1/2 font-semibold"
            : "-translate-y-1/4 translate-x-1/4 font-bold",
          getCircleSize(size, digitCount),
          getFontSize(size, digitCount)
        )}
      >
        {count || "-"}
      </p>
    </div>
  )
}

export default ContactRequestCountIcon
