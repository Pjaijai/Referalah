import React from "react"
import { IUserTypeSectionProps } from "@/modules/member/components/bars/search"
import { isExistsInListHelper } from "@/utils/common/helpers/check/is-exists-list"
import { useI18n } from "@/utils/services/internationalization/client"

import { EUserType } from "@/types/common/user-type"
import { Button } from "@/components/ui/button"
import SearchDrawer, {
  ISearchDrawerProps,
} from "@/components/customized-ui/drawers/search"

interface IUserSearchDrawerProps
  extends ISearchDrawerProps,
    IUserTypeSectionProps {}

const Fields: React.FunctionComponent<IUserTypeSectionProps> = ({
  currentUserTypes,
  onUserTypesChange,
}) => {
  const t = useI18n()
  return (
    <div className="mt-2 grid grid-cols-2 gap-2">
      <Button
        variant={
          isExistsInListHelper(currentUserTypes, EUserType.REFERRER)
            ? "default"
            : "secondary"
        }
        onClick={() => onUserTypesChange(EUserType.REFERRER)}
      >
        {t("user.type.referrer")}
      </Button>

      <Button
        variant={
          isExistsInListHelper(currentUserTypes, EUserType.REFEREE)
            ? "default"
            : "secondary"
        }
        onClick={() => onUserTypesChange(EUserType.REFEREE)}
      >
        {t("user.type.referee")}
      </Button>
    </div>
  )
}
const UserSearchDrawer: React.FunctionComponent<IUserSearchDrawerProps> = ({
  currentUserTypes,
  onUserTypesChange,
  ...props
}) => {
  return (
    <SearchDrawer
      additionalFields={Fields({ currentUserTypes, onUserTypesChange })}
      {...props}
    />
  )
}

export default UserSearchDrawer
