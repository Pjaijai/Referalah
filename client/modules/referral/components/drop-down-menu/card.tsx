import React from "react"
import Link from "next/link"
import ContactDialog from "@/modules/referral/components/dialog/contact"

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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Icons.moreVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          {url && (
            <Link
              href={url}
              target="_blank"
              className="grid grid-cols-3 items-center gap-4"
            >
              <Icons.link />
              <p className="text-lg">連結</p>
            </Link>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onContactClick}>
          <div className="grid grid-cols-3 items-center gap-4">
            <Icons.mail />
            <p className="text-lg">聯絡</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ReferralCardDropDownMenu
