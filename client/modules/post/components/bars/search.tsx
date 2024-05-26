import React from "react"
import { isExistsInListHelper } from "@/utils/common/helpers/check/is-exists-list"
import { useI18n } from "@/utils/services/internationalization/client"

import { EPostType } from "@/types/common/post-type"
import { Button } from "@/components/ui/button"
import SearchBar, {
  ISearchSearchBarProps,
} from "@/components/customized-ui/bars/search"

export interface IPostTypeSectionProps {
  currentPostTypes: EPostType[]
  onPostTypesChange: (v: EPostType) => void
}

const PostTypeSection: React.FunctionComponent<IPostTypeSectionProps> = ({
  currentPostTypes,
  onPostTypesChange,
}) => {
  const t = useI18n()
  return (
    <div className="flex flex-row gap-2 ">
      <Button
        variant={
          isExistsInListHelper(currentPostTypes, EPostType.REFERRER)
            ? "default"
            : "secondary"
        }
        onClick={() => onPostTypesChange(EPostType.REFERRER)}
      >
        {t("post.type.referer.title")}
      </Button>

      <Button
        variant={
          isExistsInListHelper(currentPostTypes, EPostType.REFEREE)
            ? "default"
            : "secondary"
        }
        onClick={() => onPostTypesChange(EPostType.REFEREE)}
      >
        {t("post.type.referee.title")}
      </Button>
      <Button
        variant={
          isExistsInListHelper(currentPostTypes, EPostType.HIRING)
            ? "default"
            : "secondary"
        }
        onClick={() => onPostTypesChange(EPostType.HIRING)}
      >
        {t("post.type.hiring.title")}
      </Button>

      <Button
        variant={
          isExistsInListHelper(currentPostTypes, EPostType.COLLABORATION)
            ? "default"
            : "secondary"
        }
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
  currentPostTypes,
  onPostTypesChange,
  ...props
}) => {
  return (
    <SearchBar
      bottomLeftSection={PostTypeSection({
        currentPostTypes,
        onPostTypesChange,
      })}
      {...props}
    />
  )
}

export default PostSearchBar
