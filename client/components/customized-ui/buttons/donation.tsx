import React from "react"

import useUserStore from "@/hooks/state/user/store"
import { Icons } from "@/components/icons"

const DonationButton = () => {
  const setIsDonationDialogOpen = useUserStore(
    (state) => state.setIsDonationDialogOpen
  )
  const handleDonationClick = () => {
    setIsDonationDialogOpen(true)
  }

  return (
    <Icons.heart
      onClick={handleDonationClick}
      className={"cursor-pointer text-rose-500  hover:fill-rose-500"}
    />
  )
}

export default DonationButton
