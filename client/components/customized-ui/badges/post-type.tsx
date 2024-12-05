import React from "react"
import usePostTypeTitle from "@/modules/post/hooks/post-type-title"

import { EPostType } from "@/types/common/post-type"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface IPostTypeBadgeProps {
  type: EPostType
}
const PostTypeBadge: React.FunctionComponent<IPostTypeBadgeProps> = ({
  type,
}) => {
  const { title, bgColor, textColor } = usePostTypeTitle(type)

  return (
    <Badge
      className={cn(
        "w-fit rounded-md px-2 py-1 text-sm font-medium  ",
        bgColor,
        textColor,
        `hover:${bgColor}`
      )}
    >
      {title}
    </Badge>
  )
}

export default PostTypeBadge
