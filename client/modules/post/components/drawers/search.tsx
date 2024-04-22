import React from "react"
import { IPostTypeSectionProps } from "@/modules/post/components/bars/search"
import { isTypeExitsInCurrentTypes } from "@/modules/post/utils/is-type-exits-in-current-types"
import { useI18n } from "@/utils/services/internationalization/client"

import { EReferralType } from "@/types/common/referral-type"
import { Button } from "@/components/ui/button"
import SearchDrawer, {
  ISearchDrawerProps,
} from "@/components/customized-ui/drawers/search"

interface IPostSearchDrawerProps
  extends ISearchDrawerProps,
    IPostTypeSectionProps {}

const Fields: React.FunctionComponent<IPostTypeSectionProps> = ({
  currentPostTypes,
  onPostTypesChange,
}) => {
  const t = useI18n()
  return (
    <div className="mt-2 grid grid-cols-3 gap-2">
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
const PostSearchDrawer: React.FunctionComponent<IPostSearchDrawerProps> = ({
  currentPostTypes,
  onPostTypesChange,
  ...props
}) => {
  return (
    <SearchDrawer
      additionalFields={Fields({ currentPostTypes, onPostTypesChange })}
      {...props}
    />
  )
}

export default PostSearchDrawer
