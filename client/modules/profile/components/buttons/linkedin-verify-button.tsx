"use client"

import React, { useState } from "react"
import { useI18n } from "@/utils/services/internationalization/client"
import { supabase } from "@/utils/services/supabase/config"

import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface ILinkedInVerifyButtonProps {
  className?: string
  showText?: boolean
}

/**
 * Button component for linking LinkedIn account via OAuth
 * Handles the OAuth flow and displays loading states
 */
const LinkedInVerifyButton: React.FC<ILinkedInVerifyButtonProps> = ({
  className = "",
  showText = true,
}) => {
  const t = useI18n()
  const { toast } = useToast()
  const [isVerifying, setIsVerifying] = useState(false)

  const handleVerify = async () => {
    setIsVerifying(true)

    try {
      // Link LinkedIn OAuth - will redirect to LinkedIn and back to this page
      const { data, error } = await supabase.auth.linkIdentity({
        provider: "linkedin_oidc",
        options: {
          redirectTo: window.location.href,
          scopes: "openid profile email",
        },
      })

      if (error) {
        console.error("LinkedIn link error:", error)
        toast({
          title: t("general.error.title"),
          description: t("profile.linkedin.verify.error.failed_to_start"),
          variant: "destructive",
        })
        setIsVerifying(false)
      }
      // Will redirect to LinkedIn, no need to handle data here
    } catch (error) {
      console.error("LinkedIn verification error:", error)
      toast({
        title: t("general.error.title"),
        description: t("profile.linkedin.verify.error.failed"),
        variant: "destructive",
      })
      setIsVerifying(false)
    }
  }

  return (
    <button
      onClick={handleVerify}
      disabled={isVerifying}
      className={`flex flex-row items-center justify-center gap-2 rounded-md bg-[#0A66C2] p-3 text-white shadow-md hover:bg-[#004182] disabled:opacity-50 ${className}`}
    >
      {isVerifying ? (
        <>
          <Icons.loader className="h-4 w-4 animate-spin" />
          {showText && (
            <span className="hidden sm:inline">{t("general.wait")}</span>
          )}
        </>
      ) : (
        <>
          <Icons.linkedin size={15} />
          {showText && (
            <span className="hidden sm:inline">
              {t("profile.linkedin.verify.button.link")}
            </span>
          )}
        </>
      )}
    </button>
  )
}

export default LinkedInVerifyButton
