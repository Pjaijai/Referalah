"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/utils/services/internationalization/client"
import { supabase } from "@/utils/services/supabase/config"
import { useQueryClient } from "@tanstack/react-query"

import { EQueryKeyString } from "@/types/common/query-key-string"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface ILinkedInUnlinkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

/**
 * Confirmation dialog for unlinking LinkedIn account
 * Handles the unlink flow with confirmation and loading states
 */
const LinkedInUnlinkDialog: React.FC<ILinkedInUnlinkDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const t = useI18n()
  const { toast } = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isUnlinking, setIsUnlinking] = useState(false)

  const handleConfirmUnlink = async () => {
    setIsUnlinking(true)

    try {
      const { data } = await supabase.auth.getUserIdentities()

      // Find LinkedIn identity
      const linkedInIdentity = data?.identities.find(
        (identity) => identity.provider === "linkedin_oidc"
      )

      if (!linkedInIdentity) {
        toast({
          title: t("general.error.title"),
          description: t("profile.linkedin.unlink.error.no_account"),
          variant: "destructive",
        })
        setIsUnlinking(false)
        return
      }

      // Unlink the identity
      const { error } = await supabase.auth.unlinkIdentity(linkedInIdentity)

      if (error) {
        console.error("LinkedIn unlink error:", error)
        toast({
          title: t("general.error.title"),
          description: t("profile.linkedin.unlink.error.failed"),
          variant: "destructive",
        })
        setIsUnlinking(false)
        return
      }

      toast({
        title: t("profile.linkedin.unlink.success.title"),
        description: t("profile.linkedin.unlink.success.description"),
      })

      // Invalidate user profile query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: [EQueryKeyString.USER_PROFILE],
      })

      // Close dialog
      onOpenChange(false)
      setIsUnlinking(false)

      // Call success callback if provided
      if (onSuccess) {
        onSuccess()
      } else {
        // Default: refresh the page to update the profile data
        router.refresh()
      }
    } catch (error) {
      console.error("LinkedIn unlink error:", error)
      toast({
        title: t("general.error.title"),
        description: t("profile.linkedin.unlink.error.failed"),
        variant: "destructive",
      })
      setIsUnlinking(false)
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("profile.linkedin.unlink.dialog.title")}</DialogTitle>
          <DialogDescription>
            {t("profile.linkedin.unlink.dialog.description")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex gap-2">
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            disabled={isUnlinking}
          >
            {t("profile.linkedin.unlink.button.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmUnlink}
            disabled={isUnlinking}
          >
            {isUnlinking ? (
              <>
                <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                {t("profile.linkedin.unlink.button.unlinking")}
              </>
            ) : (
              t("profile.linkedin.unlink.button.confirm")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LinkedInUnlinkDialog
