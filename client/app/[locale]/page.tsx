import MainPageTemplate from "@/modules/main/template"
import { getUserCount } from "@/utils/common/api"

import CommonPageLayout from "@/components/layouts/common"

// cache for 2 hours
export const revalidate = 60 * 60 * 2

export default async function IndexPage() {
  const count = await getUserCount()
  return (
    <CommonPageLayout>
      <MainPageTemplate count={count} />
    </CommonPageLayout>
  )
}
