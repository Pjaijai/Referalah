import NotificationTemplate from "@/modules/notification/template"
import { getI18n } from "@/utils/services/internationalization/server"

import CommonPageLayout from "@/components/layouts/common"

export async function generateMetadata() {
  const t = await getI18n()

  return {
    title: t("page.chat"),
    robots: "noindex, nofollow",
  }
}

export default async function NotificationPage() {
  const t = await getI18n()

  return (
    <CommonPageLayout title={t("page.notifications")}>
      <NotificationTemplate />
    </CommonPageLayout>
  )
}
