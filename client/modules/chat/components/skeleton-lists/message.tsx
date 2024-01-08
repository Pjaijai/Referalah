import React from "react"

import { cn } from "@/lib/utils"
import CardSkeleton from "@/components/customized-ui/skeletons/card"

const MessageListSkeleton = () => {
  const numberOfCards = 15
  const skeletonCards = Array.from({ length: numberOfCards }, (_, index) => (
    <div
      className={cn(
        "flex w-full flex-row ",
        index % 3 === 0 ? "justify-start" : "justify-end"
      )}
    >
      <CardSkeleton key={index} className="w-28 rounded-lg md:h-12 " />
    </div>
  ))
  return <div className="flex h-full flex-col gap-2">{skeletonCards}</div>
}

export default MessageListSkeleton
