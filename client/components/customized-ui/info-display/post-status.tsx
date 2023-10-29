import { ReferralType, ReferralTypeZh } from "@/types/common/referral-type"
import { Status } from "@/types/common/status"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface PostStatusDisplayProps {
  postStatus: Status
  postType: ReferralType
  className?: string
}

const PostStatusDisplay = ({
  postStatus,
  postType,
  className,
}: PostStatusDisplayProps) => {
  const isActive = postStatus === Status.ACTIVE

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
        {ReferralTypeZh[postType]}
      </Badge>
    </div>
  )
}

export default PostStatusDisplay
