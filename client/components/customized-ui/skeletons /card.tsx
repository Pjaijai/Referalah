import React from "react"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export interface CardSkeletonProps {
  className?: string
}

const CardSkeleton = ({ className }: CardSkeletonProps) => {
  return (
    <Skeleton className={cn(`h-[300px] rounded-sm md:h-[400px]`, className)} />
  )
}

export default CardSkeleton
