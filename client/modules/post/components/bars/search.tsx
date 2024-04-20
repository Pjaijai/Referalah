import React from "react"
import { handleTypeClick } from "@/modules/post/utils/handle-type-click"
import { isTypeExitsInCurrentTypes } from "@/modules/post/utils/is-type-exits-in-current-types"
import { useI18n } from "@/utils/services/internationalization/client"

import { EReferralType } from "@/types/common/referral-type"
import { Button } from "@/components/ui/button"
import SearchBar, {
  ISearchSearchBarProps,
} from "@/components/customized-ui/bars/search"

export interface IPostTypeSectionProps {
  currentTypes: EReferralType[]
  setTypes: (v: EReferralType[]) => void
}

const PostTypeSection: React.FunctionComponent<IPostTypeSectionProps> = ({
  currentTypes,
  setTypes,
}) => {
  const t = useI18n()
  return (
    <div className="flex flex-row gap-2">
      <Button
        variant={
          isTypeExitsInCurrentTypes(currentTypes, EReferralType.REFERRER)
            ? "default"
            : "secondary"
        }
        onClick={() =>
          handleTypeClick({
            currentTypes,
            setTypes,
            targetType: EReferralType.REFERRER,
          })
        }
      >
        {t("post.type.referer.title")}
      </Button>

      <Button
        variant={
          isTypeExitsInCurrentTypes(currentTypes, EReferralType.REFEREE)
            ? "default"
            : "secondary"
        }
        onClick={() =>
          handleTypeClick({
            currentTypes,
            setTypes,
            targetType: EReferralType.REFEREE,
          })
        }
      >
        {t("post.type.referee.title")}
      </Button>
      <Button
        variant={
          isTypeExitsInCurrentTypes(currentTypes, EReferralType.HIRING)
            ? "default"
            : "secondary"
        }
        onClick={() =>
          handleTypeClick({
            currentTypes,
            setTypes,
            targetType: EReferralType.HIRING,
          })
        }
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
  currentTypes,
  setTypes,
  ...props
}) => {
  return (
    <SearchBar
      bottomLeftSection={PostTypeSection({ currentTypes, setTypes })}
      {...props}
    />
  )
}

export default PostSearchBar
