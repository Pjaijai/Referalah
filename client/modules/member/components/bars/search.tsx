import React from "react"
import { useI18n } from "@/utils/services/internationalization/client"

import { EUserType } from "@/types/common/user-type"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import SearchBar, {
  ISearchSearchBarProps,
} from "@/components/customized-ui/bars/search"

export interface IUserTypeSectionProps {
  currentUserTypes: EUserType
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
        variant={"base"}
        className={cn(
          "text-sm md:text-xl",
          currentUserTypes === EUserType.ALL && "text-indigo-600"
        )}
        onClick={() => onUserTypesChange(EUserType.ALL)}
      >
        {t("general.all")}
      </Button>

      <Button
        variant={"base"}
        className={cn(
          "text-sm md:text-xl",
          currentUserTypes === EUserType.REFERRER && "text-indigo-600"
        )}
        onClick={() => onUserTypesChange(EUserType.REFERRER)}
      >
        {t("user.type.referrer")}
      </Button>

      <Button
        variant={"base"}
        className={cn(
          "text-sm md:text-xl",
          currentUserTypes === EUserType.REFEREE && "text-indigo-600"
        )}
        onClick={() => onUserTypesChange(EUserType.REFEREE)}
      >
        {t("user.type.referee")}
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
