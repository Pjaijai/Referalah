import ProfileTemplate from "@/modules/profile/template.tsx";
import apiService from "@/utils/common/api/index.tsx";

export async function generateMetadata({params}) {
    const { userUuid } = params
    try {
        const res = await apiService.getUserProfile({ queryKey: [, { userUuid } ] })
        return {
            title: res.username + ' 用戶檔案',
            description: res.description ?? `用戶：${res.username}`
        }
    } catch (e){
        return {
            title: '用戶檔案',
            description: '用戶檔案'
        }
    }

}

const Page = ({params}: { params: { userUuid: string } }) => {
    const {userUuid} = params
    return (
        <ProfileTemplate userUuid={userUuid}/>
    )
}

export default Page
