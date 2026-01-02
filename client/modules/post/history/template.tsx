"use client"

import React, { useState } from "react"
import {
  useCurrentLocale,
  useI18n,
} from "@/utils/services/internationalization/client"

import { TLocationData } from "@/types/api/response/location"
import { ELocale, isChineseLocale } from "@/types/common/enums/locale"
import useListPostsByUserUuid from "@/hooks/api/post/list-posts-by-user-uuid"
import usePostSortOptions from "@/hooks/common/sort/post-sort-options"
import PostCard from "@/components/customized-ui/cards/post"
import BaseSelect from "@/components/customized-ui/selects/base"
import CardSkeletonList from "@/components/customized-ui/skeletons/card-list"

interface IPostHistoryTemplateProps {
  slug: string
  locationList: TLocationData[]
}
const PostHistoryTemplate: React.FunctionComponent<
  IPostHistoryTemplateProps
> = ({ slug, locationList }) => {
  const t = useI18n()
  const locale = useCurrentLocale()

  const { data: postSortingOptions } = usePostSortOptions()
  const [sortValue, setSortValue] = useState(postSortingOptions[0].value)

  const { data, isLoading } = useListPostsByUserUuid(slug, sortValue)

  const handleSortValueChange = (value: string) => {
    setSortValue(value)
  }

  return (
    <div>
      <div className="flex w-full flex-row items-center justify-end">
        <div className="flex w-full flex-row items-center md:w-1/3">
          <label className="mr-2 w-2/5 text-end text-sm text-slate-500">
            {t("general.sorting")}
          </label>

          <BaseSelect
            options={postSortingOptions}
            onChange={handleSortValueChange}
            // defaultValue={sortValue[0].value}
            value={sortValue}
            placeholder={t("general.sorting")}
            triggerClassName="w-3/5 border-0"
          />
        </div>
      </div>

      <div className="grid w-full place-items-center">
        {isLoading && (
          <CardSkeletonList className="xs:grid-cols-1 lg:grid-cols-2" />
        )}

        {!isLoading && data && !(data.length > 0) && (
          <div className="mt-8 w-full max-w-md rounded-lg border-2 p-4 text-center">
            {t("history.no_data")}
          </div>
        )}

        {!isLoading && data && (
          <div className="x-auto mt-8 grid w-full max-w-sm grid-cols-1 gap-4 md:max-w-none md:grid-cols-2 lg:grid-cols-3">
            {data.map((data) => (
              <PostCard
                type={data.type}
                companyName={data.company_name}
                status={data.status}
                jobTitle={data.job_title}
                photoUrl={data.user && data.user.avatar_url}
                yearOfExperience={data.year_of_experience}
                key={data.uuid}
                createdAt={data.created_at}
                uuid={data.uuid}
                url={data.url}
                username={data.user.username}
                requestCount={data.contact_request_count}
                locationUuid={data.location?.uuid || null}
                locationList={locationList}
                industry={
                  isChineseLocale(locale)
                    ? data.industry?.cantonese_name || null
                    : data.industry?.english_name || null
                }
                createdBy={data.created_by && data.created_by}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PostHistoryTemplate
