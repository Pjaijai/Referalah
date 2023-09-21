import React from "react"
import { Badge } from "@/components/ui/badge"
import InfiniteScroll from "react-infinite-scroll-component"

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
        <div className="flex justify-center mt-4">
          <Badge variant={"outline"} className="flex justify-center">
            Load緊...
          </Badge>
        </div>
      }
      endMessage={
        <div className="flex justify-center mt-4">
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
