import ProfileTemplate from "@/modules/profile/template";
import {getUserProfile} from "@/utils/common/api/index";

export async function generateMetadata({ params }: { params: { userUuid: string }}) {
    const { userUuid } = params
    try {
        const res = await getUserProfile({ queryKey: [, { userUuid } ] })
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
