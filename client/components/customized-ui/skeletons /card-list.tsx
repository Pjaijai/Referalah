import React from "react"

import { cn } from "@/lib/utils"
import CardSkeleton, {
  CardSkeletonProps,
} from "@/components/customized-ui/skeletons /card"

interface CardSkeletonListProps {
  className?: string
  cardSkeletonProps?: CardSkeletonProps
}

const CardSkeletonList = ({
  className,
  cardSkeletonProps,
}: CardSkeletonListProps) => {
  return (
    <div className={cn("grid grid-cols-1 gap-4 mt-8", className)}>
      <CardSkeleton {...cardSkeletonProps} />
      <CardSkeleton {...cardSkeletonProps} />
      <CardSkeleton {...cardSkeletonProps} />
      <CardSkeleton {...cardSkeletonProps} />
      <CardSkeleton {...cardSkeletonProps} />
      <CardSkeleton {...cardSkeletonProps} />
    </div>
  )
}

export default CardSkeletonList
