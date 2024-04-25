import React from "react"
import { isExistsInListHelper } from "@/utils/common/helpers/check/is-exists-list"
import { useI18n } from "@/utils/services/internationalization/client"

import { EUserType } from "@/types/common/user-type"
import { Button } from "@/components/ui/button"
import SearchBar, {
  ISearchSearchBarProps,
} from "@/components/customized-ui/bars/search"

export interface IUserTypeSectionProps {
  currentUserTypes: EUserType[]
  onUserTypesChange: (v: EUserType) => void
}

const UserTypeSection: React.FunctionComponent<IUserTypeSectionProps> = ({
  currentUserTypes,
  onUserTypesChange,
}) => {
  const t = useI18n()
  return (
    <div className="flex flex-row gap-2">
      <Button
        variant={
          isExistsInListHelper(currentUserTypes, EUserType.REFERRER)
            ? "default"
            : "secondary"
        }
        onClick={() => onUserTypesChange(EUserType.REFERRER)}
      >
        {"post.type.referer.title"}
      </Button>

      <Button
        variant={
          isExistsInListHelper(currentUserTypes, EUserType.REFEREE)
            ? "default"
            : "secondary"
        }
        onClick={() => onUserTypesChange(EUserType.REFEREE)}
      >
        {"post.type.referee.title"}
      </Button>
    </div>
  )
}

interface IUserSearchBarProps
  extends ISearchSearchBarProps,
    IUserTypeSectionProps {}

const UserSearchBar: React.FunctionComponent<IUserSearchBarProps> = ({
  currentUserTypes,
  onUserTypesChange,
  ...props
}) => {
  return (
    <SearchBar
      bottomLeftSection={UserTypeSection({
        currentUserTypes,
        onUserTypesChange,
      })}
      {...props}
    />
  )
}

export default UserSearchBar
