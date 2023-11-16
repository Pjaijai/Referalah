import { PostStatus, TPostStatusType } from "@/types/common/post-status"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface PostStatusDisplayProps {
  postStatus: TPostStatusType
  className?: string
}

const PostStatusDisplay = ({
  postStatus,
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
    </div>
  )
}

export default PostStatusDisplay
