import React, { ReactNode } from "react"
import InfiniteScroll from "react-infinite-scroll-component"

import { Badge } from "@/components/ui/badge"

interface IBaseInfiniteScrollProps {
  dataLength: number
  next: any
  hasMore: boolean
  children: ReactNode
  endMessage?: ReactNode
  inverse?: boolean
  scrollableTarget?: string
}
const BaseInfiniteScroll: React.FunctionComponent<IBaseInfiniteScrollProps> = ({
  dataLength,
  hasMore,
  children,
  next,
  endMessage,
  inverse,
  scrollableTarget,
}) => {
  return (
    <InfiniteScroll
      dataLength={dataLength} //This is important field to render the next data
      next={next}
      hasMore={hasMore}
      inverse={inverse}
      scrollableTarget={scrollableTarget}
      loader={
        endMessage || (
          <div className="mt-4 flex justify-center">
            <Badge variant={"outline"} className="flex justify-center">
              Load緊...
            </Badge>
          </div>
        )
      }
      endMessage={
        endMessage || (
          <div className="mt-4 flex justify-center">
            <Badge variant={"outline"} className="flex justify-center">
              盡頭了！
            </Badge>
          </div>
        )
      }
    >
      <>{children}</>
    </InfiniteScroll>
  )
}

export default BaseInfiniteScroll
