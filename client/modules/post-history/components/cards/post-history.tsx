import React from "react"
import formatTimeHelper from "@/utils/common/helpers/time/format-time"

import { ICityResponse } from "@/types/api/response/city"
import { ICountryResponse } from "@/types/api/response/country"
import { IIndustryResponse } from "@/types/api/response/industry"
import { IProvinceResponse } from "@/types/api/response/province"
import { PostStatusType } from "@/types/common/post/status"
import { PostType } from "@/types/common/post/type"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface IPostHistoryCardProps {
  city: string
  companyName: string
  country: string
  createdAt: string
  description: string
  id: number
  industry: string
  jobTitle: string
  province: string
  status: PostStatusType
  type: PostType
  url: string | null
  uuid: string
  yearOfExperience: number
}
const PostHistoryCard: React.FunctionComponent<IPostHistoryCardProps> = ({
  city,
  companyName,
  country,
  createdAt,
  description,
  id,
  industry,
  jobTitle,
  province,
  status,
  type,
  url,
  uuid,
  yearOfExperience,
}) => {
  const formattedDate = formatTimeHelper({
    date: createdAt,
    format: "YYYY年MM月DD日",
  })

  return (
    <Card>
      <CardHeader className="justify-between">
        <CardTitle className="flex  flex-row justify-between items-center w-full overflow-hidden">
          <span className="text-overflow-ellipsis">{jobTitle}</span>
        </CardTitle>

        <CardDescription className="text-overflow-ellipsis">
          {companyName}
        </CardDescription>
      </CardHeader>

      <CardFooter className="hidden md:flex md:justify-between md:gap-4">
        <div>
          <Badge variant="outline">{country}</Badge>
          <Badge variant="outline">{province}</Badge>
          <Badge variant="outline">{city}</Badge>
          <Badge variant="outline">{industry}</Badge>
          <Badge variant="outline">{yearOfExperience}年經驗</Badge>
        </div>
        <p>{formattedDate}</p>
      </CardFooter>
    </Card>
  )
}

export default PostHistoryCard
