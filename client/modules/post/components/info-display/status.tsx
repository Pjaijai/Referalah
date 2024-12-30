import { useI18n } from "@/utils/services/internationalization/client"

import { EPostStatus, TPostStatusType } from "@/types/common/post-status"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface PostStatusDisplayProps {
  postStatus: TPostStatusType
  className?: string
}

// TODO remove this to be badge
const PostStatusDisplay = ({
  postStatus,
  className,
}: PostStatusDisplayProps) => {
  const t = useI18n()
  const isActive = postStatus === EPostStatus.ACTIVE

  return (
    <div className={cn("flex gap-1", className)}>
      <Badge
        variant={isActive ? "success" : "error"}
        className="flex justify-center"
      >
        {isActive ? t("post.status.open") : t("post.status.close")}
      </Badge>
    </div>
  )
}

export default PostStatusDisplay
