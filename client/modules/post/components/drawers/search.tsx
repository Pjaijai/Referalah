import React from "react"
import { IPostTypeSectionProps } from "@/modules/post/components/bars/search"
import { handleTypeClick } from "@/modules/post/utils/handle-type-click"
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
  currentTypes,
  setTypes,
}) => {
  const t = useI18n()
  return (
    <div className="mt-2 grid grid-cols-3 gap-2">
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
const PostSearchDrawer: React.FunctionComponent<IPostSearchDrawerProps> = ({
  currentTypes,
  setTypes,
  ...props
}) => {
  return (
    <SearchDrawer
      additionalFields={Fields({ currentTypes, setTypes })}
      {...props}
    />
  )
}

export default PostSearchDrawer
