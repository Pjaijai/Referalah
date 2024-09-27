import React from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface ILinkIconProps {
  className?: string
  status?: "active" | "inactive"
  url?: string
  onClick?: () => void
  openInNewTab: boolean
}
const LinkIcon: React.FunctionComponent<ILinkIconProps> = ({
  onClick,
  className,
  status,
  url,
  openInNewTab = false,
}) => {
  const router = useRouter()
  const handleUrlClick = (e: any) => {
    e.preventDefault()

    if (onClick) {
      onClick()
      return
    }

    if (!url) return

    if (openInNewTab) {
      window.open(url, "_blank")
      return
    }

    router.push(url)
  }
  return (
    <div onClick={handleUrlClick}>
      <Icons.link
        className={cn(
          "h-4 w-4 align-middle text-indigo-600",
          status === "inactive" && "opacity-30",
          className
        )}
      />
    </div>
  )
}

export default LinkIcon
