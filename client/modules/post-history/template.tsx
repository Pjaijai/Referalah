"use client"

import React from "react"
import PostHistoryCard from "@/modules/post-history/components/cards/post-history"

import useGetPostsByUserUuid from "@/hooks/api/post/get-by-userUuid"
import useUserStore from "@/hooks/state/user/store"

const PostHistoryTemplate = () => {
  const userUuid = useUserStore((state) => state.uuid)
  const { data: posts } = useGetPostsByUserUuid(userUuid)

  return (
    <div className="w-full h-full">
      <div className="flex flex-col gap-4 mt-8">
        {posts &&
          posts.map((data) => (
            <PostHistoryCard
              city={data.city.cantonese_name}
              companyName={data.company_name}
              country={data.country.cantonese_name}
              createdAt={data.created_at}
              id={data.id}
              industry={data.industry.cantonese_name}
              jobTitle={data.job_title}
              province={data.province.cantonese_name}
              status={data.status}
              type={data.type}
              url={data.url}
              uuid={data.uuid}
              yearOfExperience={data.year_of_experience}
              key={data.uuid}
            />
          ))}
      </div>
    </div>
  )
}

export default PostHistoryTemplate
