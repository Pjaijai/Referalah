import React from "react"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export interface CardSkeletonProps {
  className?: string
}

const CardSkeleton = ({ className }: CardSkeletonProps) => {
  return (
    <Skeleton
      data-testid="skeleton-card"
      className={cn(`h-[300px] rounded-sm md:h-[400px]`, className)}
    />
  )
}

export default CardSkeleton
