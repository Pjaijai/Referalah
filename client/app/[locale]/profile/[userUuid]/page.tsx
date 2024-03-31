import ProfileTemplate from "@/modules/profile/template"
import {
  getCityList,
  getCountryList,
  getIndustryList,
  getProvinceList,
  getUserProfile,
} from "@/utils/common/api/index"

export async function generateMetadata({
  params,
}: {
  params: { userUuid: string }
}) {
  const { userUuid } = params
  try {
    const res = await getUserProfile(userUuid)
    return {
      title: res.username + " 用戶檔案",
      description: res.description ?? `用戶：${res.username}`,
    }
  } catch (e) {
    return {
      title: "用戶檔案",
      description: "用戶檔案",
    }
  }
}
export const revalidate = 60
export const fetchCache = "default-cache"

const Page = async ({ params }: { params: { userUuid: string } }) => {
  const { userUuid } = params

  const countryList = await getCountryList()
  const provinceList = await getProvinceList()
  const cityList = await getCityList()
  const industryList = await getIndustryList()

  return (
    <ProfileTemplate
      userUuid={userUuid}
      countryList={countryList}
      provinceList={provinceList}
      cityList={cityList}
      industryList={industryList}
    />
  )
}

export default Page
