import React, { ReactNode } from "react"
import { useI18n } from "@/utils/services/internationalization/client"
import InfiniteScroll from "react-infinite-scroll-component"

import { Badge } from "@/components/ui/badge"
import LoadingBalloonSpinner from "@/components/customized-ui/spinner/ball"

interface IBaseInfiniteScrollProps {
  dataLength: number
  next: any
  hasMore: boolean
  children: ReactNode
  endMessage?: ReactNode
  inverse?: boolean
  scrollableTarget?: string
  className?: string
}
const BaseInfiniteScroll: React.FunctionComponent<IBaseInfiniteScrollProps> = ({
  dataLength,
  hasMore,
  children,
  next,
  endMessage,
  inverse,
  scrollableTarget,
  className,
}) => {
  const t = useI18n()
  return (
    <InfiniteScroll
      dataLength={dataLength} //This is important field to render the next data
      className={className}
      next={next}
      hasMore={hasMore}
      inverse={inverse}
      scrollableTarget={scrollableTarget}
      loader={
        endMessage || <LoadingBalloonSpinner isRandom maxRandomBalls={10} />
      }
      endMessage={
        endMessage || (
          <div className="mt-4 flex justify-center">
            <Badge variant={"outline"} className="flex justify-center">
              {t("search.reach_final_result")}
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
