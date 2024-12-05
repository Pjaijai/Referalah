import React from "react"
import { useScopedI18n } from "@/utils/services/internationalization/client"

import {
  IMemberContact,
  IPostContact,
  TContactRequestListResponse,
} from "@/types/api/response/contact-request/contact-request-list"
import useCreatedAt from "@/hooks/common/created-at"
import Marquee from "@/components/magicui/marquee"

const PostRow = (props: IPostContact) => {
  const { data: formattedCreatedAt } = useCreatedAt({
    createdAt: props.createdAt,
  })
  const scopedT = useScopedI18n("index")
  return (
    <div className="flex flex-row gap-1">
      <p>{formattedCreatedAt}</p>
      <p className="ml-3">@{props.senderUserName}</p>
      <p className="shrink-0">{scopedT("requested")}</p>
      <p className="truncate font-medium text-indigo-600">
        {props.postJobTitle}
      </p>
    </div>
  )
}

const MemberRow = (props: IMemberContact) => {
  const { data: formattedCreatedAt } = useCreatedAt({
    createdAt: props.createdAt,
  })
  const scopedT = useScopedI18n("index")
  return (
    <div className="flex flex-row gap-1 ">
      <p>{formattedCreatedAt}</p>
      <p className="ml-3">@{props.senderUserName} </p>
      <p>{scopedT("contacted")}</p>
      <p className="font-medium text-indigo-600">@{props.receiverUserName}</p>
    </div>
  )
}
interface IContactRequestCarouselProps {
  list: TContactRequestListResponse[]
}
const ContactRequestCarousel: React.FunctionComponent<
  IContactRequestCarouselProps
> = ({ list }) => {
  return (
    <div className="relative flex h-32 w-full flex-row items-center justify-center overflow-hidden  bg-slate-50 ">
      <Marquee vertical className="text-xs [--duration:60s]">
        {list.map((data) => {
          if (data.type === "post") return <PostRow {...data} />
          if (data.type === "member") return <MemberRow {...data} />
        })}
      </Marquee>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-slate-50 dark:from-background"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-50 dark:from-background"></div>
    </div>
  )
}

export default ContactRequestCarousel
