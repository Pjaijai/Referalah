import MainPageTemplate from "@/modules/main/template"
import {
  getUserCount,
  listLatestContactRequest,
  searchPostApi,
} from "@/utils/common/api"

import { EPostType } from "@/types/common/post-type"
import CommonPageLayout from "@/components/layouts/common"

// cache for 1 hours
export const revalidate = 60 * 60

export default async function IndexPage() {
  const count = await getUserCount()
  const posts = await searchPostApi({
    numberOfDataPerPage: 8,
    page: 0,
    sortingType: "createdAt,dec",
    companyName: "",
    jobTitle: "",
    maxYearOfExperience: 100,
    minYearOfExperience: 0,
    types: [EPostType.REFERRER, EPostType.HIRING, EPostType.COLLABORATION],
  })

  const list = await listLatestContactRequest()

  return (
    <CommonPageLayout>
      <MainPageTemplate count={count} posts={posts} contactList={list} />
    </CommonPageLayout>
  )
}
