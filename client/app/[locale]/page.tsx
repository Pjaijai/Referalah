import MainPageTemplate from "@/modules/main/template"
import {
  getUserCount,
  listLatestContactRequest,
  searchPostApi,
} from "@/utils/common/api"

import { EReferralType } from "@/types/common/referral-type"

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
    types: [
      EReferralType.REFERRER,
      EReferralType.REFEREE,
      EReferralType.HIRING,
    ],
  })

  const list = await listLatestContactRequest()

  return <MainPageTemplate count={count} posts={posts} contactList={list} />
}
