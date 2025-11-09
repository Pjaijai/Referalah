import ProfileTemplate from "@/modules/profile/template"
import { getLocationList, getUserProfile } from "@/utils/common/api/index"
import { getI18n } from "@/utils/services/internationalization/server"

import { siteConfig } from "@/config/site"

export async function generateMetadata({
  params,
}: {
  params: { locale: string; userUuid: string }
}) {
  const { userUuid } = params
  const t = await getI18n()
  try {
    const res = await getUserProfile(userUuid)

    const title = `${res.username} | ${t("page.profile")}`

    return {
      title: title,
      description: res.description,
      robots: "index, follow",
      openGraph: {
        ...siteConfig.defaultMetaData.openGraph,
        locale: params.locale,
        url: `${process.env.NEXT_PUBLIC_WEB_URL}${params.locale}/${siteConfig.page.profile.href}/${params.userUuid}`,
        title: title,
        description: res.description,
      },
      twitter: {
        ...siteConfig.defaultMetaData.twitter,
        title: title,
        description: res.description,
      },
    }
  } catch (e) {
    return {
      title: "用戶檔案",
      description: "用戶檔案",
    }
  }
}

const Page = async ({ params }: { params: { userUuid: string } }) => {
  const { userUuid } = params
  const locationList = await getLocationList()

  return <ProfileTemplate userUuid={userUuid} locationList={locationList} />
}

export default Page
