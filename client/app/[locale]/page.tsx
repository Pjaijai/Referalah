import MainPageTemplate from "@/modules/main/template"
import { getUserCount, searchPostApi } from "@/utils/common/api"

import { EReferralType } from "@/types/common/referral-type"
import CommonPageLayout from "@/components/layouts/common"

// cache for 12 hours
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

  return (
    <CommonPageLayout>
      <MainPageTemplate count={count} posts={posts} />
    </CommonPageLayout>
  )
}
