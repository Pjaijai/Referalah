import React from "react"

import CardSkeleton from "@/components/customized-ui/skeletons/card"

const ConversationListSkeleton = () => {
  const numberOfCards = 10
  const skeletonCards = Array.from({ length: numberOfCards }, (_, index) => (
    <CardSkeleton key={index} className="rounded-sm md:h-20" />
  ))
  return <div className="flex h-full flex-col gap-2">{skeletonCards}</div>
}

export default ConversationListSkeleton
