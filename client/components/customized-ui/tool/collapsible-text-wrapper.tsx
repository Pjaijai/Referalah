import { useRef } from "react"

import { cn } from "@/lib/utils"
import useTruncatedElement from "@/hooks/common/useTruncatedElement"
import { Button, ButtonProps } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface ICollapsibleTextWrapperProps {
  text: string
  className?: string
  expandButtonProps?: ButtonProps
}

const CollapsibleTextWrapper = ({
  text,
  className,
  expandButtonProps,
}: ICollapsibleTextWrapperProps) => {
  const ref = useRef(null)
  const { isTruncated, isShowingMore, toggleIsShowingMore } =
    useTruncatedElement({
      ref,
    })

  return (
    <div>
      <p
        ref={ref}
        className={cn(
          `break-words text-xl whitespace-pre-wrap ${
            !isShowingMore && "line-clamp-4"
          }`,
          className
        )}
      >
        {text}
      </p>
      {isTruncated && (
        <Button
          variant="link"
          size="sm"
          onClick={toggleIsShowingMore}
          {...expandButtonProps}
        >
          {isShowingMore ? "收起" : "展開"}
          <Icons.chevronDown className="ml-1 h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

export default CollapsibleTextWrapper
