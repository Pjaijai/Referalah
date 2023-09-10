import React from "react"
import Link from "next/link"
import ContactDialog from "@/modules/referral/components/dialog/contact"

import { Button } from "@/components/ui/button"
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
  const handleClick = () => {
    onContactClick()
  }
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
              className="flex justify-start items-center gap-x-4 text-lg"
            >
              <Icons.link />
              <p>連結</p>
            </Link>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleClick}>
          <div className="flex justify-start items-center gap-x-4 text-lg">
            <Icons.mail />
            <p>contact</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ReferralCardDropDownMenu
