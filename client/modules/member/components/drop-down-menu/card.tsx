import React from "react"
import Link from "next/link"
import { useI18n } from "@/utils/services/internationalization/client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"

interface IReferralCardDropDownMenuProps {
  url: string | null
  onContactClick: () => void
}
const ReferralCardDropDownMenu: React.FunctionComponent<
  IReferralCardDropDownMenuProps
> = ({ url, onContactClick }) => {
  const t = useI18n()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Icons.moreVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {url && (
          <DropdownMenuItem>
            <Link
              href={url}
              target="_blank"
              className="grid grid-cols-3 items-center gap-4"
            >
              <Icons.link />
              <p className="text-lg">{t("general.link")}</p>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={onContactClick}>
          <div className="grid grid-cols-3 items-center gap-4">
            <Icons.mail />
            <p className="text-lg">{t("general.contact")}</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ReferralCardDropDownMenu
