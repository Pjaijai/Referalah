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
      loader={<h4>Loading...</h4>}
      endMessage={
        <p className="flex justify-center mt-4">
          <Badge variant={"outline"} className="flex justify-center">
            盡頭了！
          </Badge>
        </p>
      }
    >
      {children}
    </InfiniteScroll>
  )
}

export default BaseInfiniteScroll
