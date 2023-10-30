import { ReferralTypeTranslationMapper } from "@/utils/common/mappers/translation/referral-type"

import { PostStatus } from "@/types/common/post-status"
import { ReferralType } from "@/types/common/referral-type"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface PostStatusDisplayProps {
  postStatus: PostStatus
  postType: ReferralType
  className?: string
}

const PostStatusDisplay = ({
  postStatus,
  postType,
  className,
}: PostStatusDisplayProps) => {
  const isActive = postStatus === PostStatus.ACTIVE

  return (
    <div className={cn("flex gap-1", className)}>
      <Badge
        variant={isActive ? "success" : "error"}
        className="flex justify-center"
      >
        {isActive ? "開放" : "已關閉"}
      </Badge>
      <Badge
        variant={postType === ReferralType.REFERRER ? "purple" : "blue"}
        className="flex justify-center border-2"
      >
        {ReferralTypeTranslationMapper[postType].zh}
      </Badge>
    </div>
  )
}

export default PostStatusDisplay
