import React from "react"

import { IListPostResponse } from "@/types/api/response/referer-post"
import PostHistoryCard from "@/modules/post/history/components/cards/post-history"

interface IPostHistoryTemplateProps {
  data?: IListPostResponse[]
  isLoading: boolean
}
const PostHistoryTemplate: React.FunctionComponent<
  IPostHistoryTemplateProps
> = ({ data,isLoading }) => {

  return (
    <>
     {!isLoading && !data && (
      <div className="mt-8 rounded-lg border-2 p-4 text-center">
        冇資料🥲不如開個Post先？？
      </div>
    )}

{!isLoading && data && (
      <div className="mt-8 grid w-full grid-cols-1 gap-4 overflow-hidden lg:grid-cols-2">
        {
          data.map(data=>(
            <PostHistoryCard
            city={data.city && data.city.cantonese_name}
            companyName={data.company_name}
            country={data.country && data.country.cantonese_name}
            status={data.status}
            description={data.description}
            industry={data.industry && data.industry.cantonese_name}
            jobTitle={data.job_title}
            photoUrl={data.user && data.user.avatar_url}
            
            province={data.province && data.province.cantonese_name}
            yearOfExperience={data.year_of_experience}
            key={data.uuid}
            createdAt={data.created_at}
uuid={data.uuid}
url={data.url}
            />
          ))
          
        }
       
      </div>
    )}
    </>
  )
}

export default PostHistoryTemplate
