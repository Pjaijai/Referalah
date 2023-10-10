import React from "react"
import formatTimeHelper from "@/utils/common/helpers/time/format-time"

import { PostStatusType } from "@/types/common/post/status"
import { PostType } from "@/types/common/post/type"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import BaseTooltip from "@/components/customized-ui/tool-tip/base"
import { Icons } from "@/components/icons"

interface IPostHistoryCardProps {
  city: string
  companyName: string
  country: string
  createdAt: string
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

  const typeText = type === PostType.REFERRER ? "工搵人" : "人搵工"
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex flex-row  items-center gap-2">
            <Badge className="text-sm">{typeText}</Badge>
            {status === PostStatusType.ACTIVE && (
              <p className="text-destructive font-semibold">不再受理</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            {url && (
              <BaseTooltip content={<p>{url}</p>} trigger={<Icons.link />} />
            )}

            <Icons.pencil />
          </div>
        </div>

        <CardTitle className="flex  flex-row justify-between items-center w-full overflow-hidden mt-2">
          <span className="text-overflow-ellipsis">{jobTitle}</span>
        </CardTitle>

        <CardDescription className="text-overflow-ellipsis">
          {companyName}
        </CardDescription>
      </CardHeader>

      <CardFooter className="md:flex-row flex-col md:justify-between gap-4">
        <div>
          <Badge variant="outline">{country}</Badge>
          <Badge variant="outline">{province}</Badge>
          <Badge variant="outline">{city}</Badge>
          <Badge variant="outline">{industry}</Badge>
          <Badge variant="outline">{yearOfExperience}年經驗</Badge>
        </div>
      </CardFooter>
    </Card>
  )
}

export default PostHistoryCard
