import NotificationTemplate from "@/modules/notification/template"
import { getI18n } from "@/utils/services/internationalization/server"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.searchMember.metadata

export default async function NotificationPage() {
  const t = await getI18n()

  return (
    <CommonPageLayout title={"Notification"}>
      <NotificationTemplate />
    </CommonPageLayout>
  )
}
