import React from "react"
import ContentSection from "@/modules/main/components/content-section"

import { TContactRequestListResponse } from "@/types/api/response/contact-request/contact-request-list"
import { ISearchPostResponse } from "@/types/api/response/referer-post"

const MainPageTemplate = ({
  count,
  posts,
  contactList,
}: {
  count: number | null
  posts: ISearchPostResponse[]
  contactList: TContactRequestListResponse[]
}) => {
  return (
    <div className="relative mt-20 flex w-full flex-row items-center justify-center md:mt-16 ">
      <div className="relative z-30 h-fit w-full overflow-hidden md:mx-auto md:max-w-7xl  md:p-4 ">
        <ContentSection count={count} posts={posts} contactList={contactList} />
      </div>
    </div>
  )
}

export default MainPageTemplate
