import { Suspense } from "react"
import MainPageTemplate from "@/modules/main/template"
import {
  getLocationList,
  getUserCount,
  listLatestContactRequest,
  searchPost,
} from "@/utils/common/api"

import { EPostType } from "@/types/common/post-type"
import CommonPageLayout from "@/components/layouts/common"

import Loading from "./loading"

export const revalidate = 60 * 60 * 24

export default async function IndexPage() {
  return (
    <CommonPageLayout>
      <Suspense fallback={<Loading />}>
        <MainPageContent />
      </Suspense>
    </CommonPageLayout>
  )
}

async function MainPageContent() {
  const [count, posts, list, locationList] = await Promise.all([
    getUserCount(),
    searchPost({
      keywords: "",
      numberOfDataPerPage: 8,
      experience: 0,
      page: 0,
      type: EPostType.ALL,
      sortingType: "createdAt,dec",
    }),
    listLatestContactRequest(),
    getLocationList(),
  ])

  return (
    <MainPageTemplate
      count={count}
      posts={posts}
      contactList={list}
      locationList={locationList}
    />
  )
}
