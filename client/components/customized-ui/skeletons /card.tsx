import React from "react"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export interface CardSkeletonProps {
  className?: string
}

const CardSkeleton = ({ className }: CardSkeletonProps) => {
  return (
    <Skeleton className={cn(`h-[300px] md:h-[400px] rounded-sm`, className)} />
  )
}

export default CardSkeleton
