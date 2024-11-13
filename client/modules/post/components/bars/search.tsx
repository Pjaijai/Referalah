import React from "react"
import { useI18n } from "@/utils/services/internationalization/client"

import { EPostType } from "@/types/common/post-type"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import SearchBar, {
  ISearchSearchBarProps,
} from "@/components/customized-ui/bars/search"

export interface IPostTypeSectionProps {
  currentPostType: EPostType
  onPostTypesChange: (v: EPostType) => void
}

const PostTypeSection: React.FunctionComponent<IPostTypeSectionProps> = ({
  currentPostType,
  onPostTypesChange,
}) => {
  const t = useI18n()
  return (
    <div className="flex flex-row">
      <Button
        variant={"base"}
        className={cn(
          "text-sm md:text-xl",
          currentPostType === EPostType.ALL && "text-indigo-600"
        )}
        onClick={() => onPostTypesChange(EPostType.ALL)}
      >
        {t("general.all")}
      </Button>

      <Button
        variant={"base"}
        className={cn(
          "text-sm md:text-xl",
          currentPostType === EPostType.REFERRER && "text-indigo-600"
        )}
        onClick={() => onPostTypesChange(EPostType.REFERRER)}
      >
        {t("post.type.referer.title")}
      </Button>

      <Button
        variant={"base"}
        className={cn(
          "text-sm md:text-xl",
          currentPostType === EPostType.REFEREE && "text-indigo-600"
        )}
        onClick={() => onPostTypesChange(EPostType.REFEREE)}
      >
        {t("post.type.referee.title")}
      </Button>
      <Button
        variant={"base"}
        onClick={() => onPostTypesChange(EPostType.HIRING)}
        className={cn(
          "text-sm md:text-xl",
          currentPostType === EPostType.HIRING && "text-indigo-600"
        )}
      >
        {t("post.type.hiring.title")}
      </Button>

      <Button
        className={cn(
          "text-sm md:text-xl",
          currentPostType === EPostType.COLLABORATION && "text-indigo-600"
        )}
        variant={"base"}
        onClick={() => onPostTypesChange(EPostType.COLLABORATION)}
      >
        {t("post.type.collaboration.title")}
      </Button>
    </div>
  )
}

interface IPostSearchBarProps
  extends ISearchSearchBarProps,
    IPostTypeSectionProps {}

const PostSearchBar: React.FunctionComponent<IPostSearchBarProps> = ({
  currentPostType,
  onPostTypesChange,
  ...props
}) => {
  return (
    <SearchBar
      bottomLeftSection={PostTypeSection({
        currentPostType,
        onPostTypesChange,
      })}
      {...props}
    />
  )
}

export default PostSearchBar
