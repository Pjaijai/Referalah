import React from "react"
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
      loader={<h4>Loading...</h4>}
      endMessage={
        <p style={{ textAlign: "center" }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
      className="grid xs:grid-cols-1 grid-cols-3  w-full border-2 border-red-400"
    >
      {children}
    </InfiniteScroll>
  )
}

export default BaseInfiniteScroll
