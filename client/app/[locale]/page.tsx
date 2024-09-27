import MainPageTemplate from "@/modules/main/template"
import {
  getUserCount,
  listLatestContactRequest,
  searchPost,
} from "@/utils/common/api"

import { EPostType } from "@/types/common/post-type"
import CommonPageLayout from "@/components/layouts/common"

// cache for 1 hours
export const revalidate = 60 * 60

export default async function IndexPage() {
  const count = await getUserCount()
  const posts = await searchPost({
    keywords: "",
    numberOfDataPerPage: 8,
    experience: 0,
    page: 0,
    type: EPostType.ALL,
    sortingType: "createdAt,dec",
  })

  const list = await listLatestContactRequest()

  return (
    <CommonPageLayout>
      <MainPageTemplate count={count} posts={posts} contactList={list} />
    </CommonPageLayout>
  )
}
