import MainPageTemplate from "@/modules/main/template"
import { getUserCount, searchPostApi } from "@/utils/common/api"

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
    type: EReferralType.REFERRER,
  })

  return <MainPageTemplate count={count} posts={posts} />
}
