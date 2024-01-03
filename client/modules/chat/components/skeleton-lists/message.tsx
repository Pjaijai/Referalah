import React from "react"

import CardSkeleton from "@/components/customized-ui/skeletons/card"

const MessageListSkeleton = () => {
  const numberOfCards = 10
  const skeletonCards = Array.from({ length: numberOfCards }, (_, index) => (
    <div className="w-full">
      <CardSkeleton key={index} className="w-20 rounded-sm md:h-20" />
    </div>
  ))
  return <div className="flex h-full flex-col gap-2">{skeletonCards}</div>
}

export default MessageListSkeleton
