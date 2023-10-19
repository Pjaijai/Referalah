import React from "react"
import InfiniteScroll from "react-infinite-scroll-component"

import { Badge } from "@/components/ui/badge"

interface IBaseInfiniteScrollProps {
  dataLength: number
  next: any
  hasMore: boolean
  children: React.ReactNode
}
const BaseInfiniteScroll: React.FunctionComponent<IBaseInfiniteScrollProps> = ({
  dataLength,
  hasMore,
  children,
  next,
}) => {
  return (
    <InfiniteScroll
      dataLength={dataLength} //This is important field to render the next data
      next={next}
      hasMore={hasMore}
      loader={
        <div className="mt-4 flex justify-center">
          <Badge variant={"outline"} className="flex justify-center">
            Load緊...
          </Badge>
        </div>
      }
      endMessage={
        <div className="mt-4 flex justify-center">
          <Badge variant={"outline"} className="flex justify-center">
            盡頭了！
          </Badge>
        </div>
      }
    >
      {children}
    </InfiniteScroll>
  )
}

export default BaseInfiniteScroll
