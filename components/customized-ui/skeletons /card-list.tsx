import React from "react"

import CardSkeleton from "@/components/customized-ui/skeletons /card"

const CardSkeletonList = () => {
  return (
    <div className="flex flex-col mt-8 gap-4">
      <CardSkeleton />
      <CardSkeleton /> <CardSkeleton /> <CardSkeleton /> <CardSkeleton />
      <CardSkeleton />
    </div>
  )
}

export default CardSkeletonList
