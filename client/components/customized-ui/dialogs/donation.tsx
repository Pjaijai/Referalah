import React, { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const DonationDialog = () => {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Donation</DialogTitle>
          <DialogDescription>Donation</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default DonationDialog
