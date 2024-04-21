import React from "react"
import { isTypeExitsInCurrentTypes } from "@/modules/post/utils/is-type-exits-in-current-types"
import { useI18n } from "@/utils/services/internationalization/client"

import { EReferralType } from "@/types/common/referral-type"
import { Button } from "@/components/ui/button"
import SearchBar, {
  ISearchSearchBarProps,
} from "@/components/customized-ui/bars/search"

export interface IPostTypeSectionProps {
  currentPostTypes: EReferralType[]
  onPostTypesChange: (v: EReferralType) => void
}

const PostTypeSection: React.FunctionComponent<IPostTypeSectionProps> = ({
  currentPostTypes,
  onPostTypesChange,
}) => {
  const t = useI18n()
  return (
    <div className="flex flex-row gap-2">
      <Button
        variant={
          isTypeExitsInCurrentTypes(currentPostTypes, EReferralType.REFERRER)
            ? "default"
            : "secondary"
        }
        onClick={() => onPostTypesChange(EReferralType.REFERRER)}
      >
        {t("post.type.referer.title")}
      </Button>

      <Button
        variant={
          isTypeExitsInCurrentTypes(currentPostTypes, EReferralType.REFEREE)
            ? "default"
            : "secondary"
        }
        onClick={() => onPostTypesChange(EReferralType.REFEREE)}
      >
        {t("post.type.referee.title")}
      </Button>
      <Button
        variant={
          isTypeExitsInCurrentTypes(currentPostTypes, EReferralType.HIRING)
            ? "default"
            : "secondary"
        }
        onClick={() => onPostTypesChange(EReferralType.HIRING)}
      >
        {t("post.type.hiring.title")}
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
