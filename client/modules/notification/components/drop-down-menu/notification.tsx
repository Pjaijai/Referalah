import React from "react"
import NotificationInfiniteScroll, {
  INotificationInfiniteScrollProps,
} from "@/modules/notification/components/infinite-scroll/notification"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import BellIcon, { IBellIconProps } from "@/components/customized-ui/icons/bell"

interface NotificationDropDownMenuProps
  extends IBellIconProps,
    INotificationInfiniteScrollProps {}
const NotificationDropDownMenu: React.FunctionComponent<
  NotificationDropDownMenuProps
> = ({ showDot, data, fetchNextPage, dataLength, hasMore, inverse }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <BellIcon showDot={showDot} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div
          className="flex h-52  w-96 flex-col-reverse  overflow-y-auto overflow-x-hidden p-2"
          id="notificationScrollDiv"
        >
          <NotificationInfiniteScroll
            data={data}
            fetchNextPage={fetchNextPage}
            dataLength={dataLength}
            hasMore={hasMore}
            inverse={inverse}
            scrollableTarget="notificationScrollDiv"
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NotificationDropDownMenu
