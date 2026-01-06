"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/utils/services/internationalization/client"
import { supabase } from "@/utils/services/supabase/config"

import { EMessageType } from "@/types/common/message-type"
import { EReferralType } from "@/types/common/referral-type"
import { ISocialLinksData } from "@/types/common/social-links-data"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import useUserStore from "@/hooks/state/user/store"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import BaseAvatar from "@/components/customized-ui/avatars/base"
import LinkedInBadge from "@/components/customized-ui/badges/linkedin/linkedin"
import RefereeBadge from "@/components/customized-ui/badges/referee/referee"
import ReferrerBadge from "@/components/customized-ui/badges/referrer/referrer"
import ContactButton from "@/components/customized-ui/buttons/contact"
import SocialIconWithTooltip from "@/components/customized-ui/icons/social-icon-with-tooltip"
import { Icons } from "@/components/icons"

export interface IViewProfileTemplateProps {
  photoUrl?: string
  username: string | null
  description: string | null
  company: string | null
  jobTitle: string | null
  yearOfExperience?: number | null
  location: string | null
  industry: string | null
  socialLinks: ISocialLinksData[]
  isReferer: boolean
  isReferee: boolean
  slug: string
  requestCount: number
  postCount: number
  linkedInVerification?: {
    user_uuid: string
    name: string | null
    picture: string | null
  } | null
}
const ViewProfileTemplate: React.FunctionComponent<
  IViewProfileTemplateProps
> = ({
  photoUrl,
  username,
  description,
  company,
  jobTitle,
  yearOfExperience,
  location,
  socialLinks,
  industry,
  isReferer,
  isReferee,
  slug,
  requestCount,
  postCount,
  linkedInVerification,
}) => {
  const t = useI18n()
  const userUuid = useUserStore((state) => state.uuid)
  const isViewingOwnProfile = slug === userUuid
  const userState = useUserStore((state) => state)
  const { toast } = useToast()
  const router = useRouter()

  const [isVerifyingLinkedIn, setIsVerifyingLinkedIn] = useState(false)
  const [isUnlinkingLinkedIn, setIsUnlinkingLinkedIn] = useState(false)
  const [showUnlinkDialog, setShowUnlinkDialog] = useState(false)

  const isLinkedInVerified = !!linkedInVerification

  const handleLinkedInVerify = async () => {
    console.log("🔗 LinkedIn verify button clicked")
    setIsVerifyingLinkedIn(true)

    try {
      // Check if user is signed in
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: t("general.error.title"),
          description: "Please sign in first",
          variant: "destructive",
        })
        setIsVerifyingLinkedIn(false)
        return
      }

      console.log("Current user:", user.id)

      // Link LinkedIn OAuth - will redirect to LinkedIn and back to this page
      const { data, error } = await supabase.auth.linkIdentity({
        provider: "linkedin_oidc",
        options: {
          redirectTo: window.location.href, // Redirect back to this profile page
          scopes: "openid profile email",
        },
      })

      if (error) {
        console.error("LinkedIn link error:", error)
        toast({
          title: t("general.error.title"),
          description: "Failed to start LinkedIn verification",
          variant: "destructive",
        })
        setIsVerifyingLinkedIn(false)
      }
      // Will redirect to LinkedIn, no need to handle data here
    } catch (error) {
      console.error("LinkedIn verification error:", error)
      toast({
        title: t("general.error.title"),
        description: "Failed to verify LinkedIn",
        variant: "destructive",
      })
      setIsVerifyingLinkedIn(false)
    }
  }

  const handleLinkedInUnlink = async () => {
    // Show confirmation dialog instead of unlinking directly
    setShowUnlinkDialog(true)
  }

  const confirmUnlink = async () => {
    console.log("🔗 LinkedIn unlink confirmed")
    setShowUnlinkDialog(false)
    setIsUnlinkingLinkedIn(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: t("general.error.title"),
          description: "Please sign in first",
          variant: "destructive",
        })
        setIsUnlinkingLinkedIn(false)
        return
      }

      // Find LinkedIn identity
      const linkedInIdentity = user.identities?.find(
        (identity) => identity.provider === "linkedin_oidc"
      )

      if (!linkedInIdentity) {
        toast({
          title: t("general.error.title"),
          description: "No LinkedIn account linked",
          variant: "destructive",
        })
        setIsUnlinkingLinkedIn(false)
        return
      }

      // Unlink the identity
      const { error } = await supabase.auth.unlinkIdentity(linkedInIdentity)

      if (error) {
        console.error("LinkedIn unlink error:", error)
        toast({
          title: t("general.error.title"),
          description: "Failed to unlink LinkedIn",
          variant: "destructive",
        })
        setIsUnlinkingLinkedIn(false)
        return
      }

      toast({
        title: "LinkedIn Unlinked",
        description: "Your LinkedIn account has been unlinked successfully",
      })

      // Refresh the page to update the profile data
      router.refresh()

      setIsUnlinkingLinkedIn(false)
    } catch (error) {
      console.error("LinkedIn unlink error:", error)
      toast({
        title: t("general.error.title"),
        description: "Failed to unlink LinkedIn",
        variant: "destructive",
      })
      setIsUnlinkingLinkedIn(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) throw error

      router.push(siteConfig.page.main.href)
      userState.reSetUser()
      toast({
        title: t("auth.form.sign_out.success"),
      })
    } catch (err) {
      return toast({
        title: t("auth.form.sign_out.error"),
        description: t("general.error.description"),
        variant: "destructive",
      })
    }
  }

  const professionalInfo = [jobTitle, company ? ` @ ${company}` : null].filter(
    Boolean
  )

  const showContactButton = isReferee || isReferer
  const showPostHistoryButton = typeof postCount === "number" && postCount > 0

  return (
    <>
      <div>
        <div className="relative">
          <div className="h-28  bg-slate-100" />
          <Button
            onClick={() => router.back()}
            className={cn(
              buttonVariants({ variant: "secondary" }),
              " absolute left-4 top-4 z-10 bg-transparent p-0 md:hidden"
            )}
          >
            <Icons.chevronLeft className="h-6 w-6" />
          </Button>

          <div className="absolute right-6 top-4 md:hidden">
            {isViewingOwnProfile && (
              <div className="flex flex-row gap-2">
                {/* LinkedIn Link/Unlink Button - Mobile */}
                {!isLinkedInVerified ? (
                  <button
                    onClick={handleLinkedInVerify}
                    disabled={isVerifyingLinkedIn}
                    className="flex flex-row items-center justify-center gap-2 rounded-md bg-[#0A66C2] p-3 text-white shadow-md hover:bg-[#004182] disabled:opacity-50"
                  >
                    {isVerifyingLinkedIn ? (
                      <Icons.loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Icons.linkedin size={15} />
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleLinkedInUnlink}
                    disabled={isUnlinkingLinkedIn}
                    className="flex flex-row items-center justify-center gap-2 rounded-md border border-slate-600 bg-white p-3 text-slate-600 shadow-md hover:bg-slate-50 disabled:opacity-50"
                  >
                    {isUnlinkingLinkedIn ? (
                      <Icons.loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Icons.linkedin size={15} />
                    )}
                  </button>
                )}

                <button
                  onClick={() => {
                    router.push(siteConfig.page.editProfile.href)
                  }}
                  className="flex flex-row items-center justify-center gap-2 rounded-md bg-white p-3 text-slate-500 shadow-md"
                >
                  <Icons.pencil size={15} />
                  <span>{t("profile.view.edit_profile")}</span>
                </button>
              </div>
            )}
          </div>

          <div className="relative px-4 pt-4 md:px-12">
            {/* Added padding-top */}
            <div className="absolute -top-24 left-4 md:-top-12 md:left-12">
              {/* Positioned avatar */}
              <BaseAvatar
                url={photoUrl}
                alt={username}
                fallBack={username && username[0]}
                size="veryLarge"
              />
            </div>

            {/* Desktop */}
            <div className="hidden h-24 flex-row   md:flex ">
              <div className="w-48" /> {/* Spacer for avatar */}
              <div className="ml-12 flex w-full flex-col">
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-col">
                    <div className="flex flex-row">
                      <div className="flex flex-wrap items-center justify-start text-2xl font-semibold">
                        {professionalInfo.map((i, index) => (
                          <React.Fragment key={index}>
                            <span />
                            <span>{i}</span>
                          </React.Fragment>
                        ))}
                      </div>

                      <div className="ml-4 flex flex-row gap-2">
                        {isReferer && <ReferrerBadge />}
                        {isReferee && <RefereeBadge />}
                        {/* Show verified badge next to Referee/Referrer badges */}
                        {isLinkedInVerified && (
                          <LinkedInBadge
                            name={linkedInVerification?.name}
                            picture={linkedInVerification?.picture}
                            onUnlink={
                              isViewingOwnProfile
                                ? handleLinkedInUnlink
                                : undefined
                            }
                            isUnlinking={isUnlinkingLinkedIn}
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex flex-row items-center gap-3">
                      <h5 className="text-lg font-semibold text-slate-400">
                        {username}
                      </h5>
                    </div>
                  </div>

                  {isViewingOwnProfile && (
                    <div className="flex flex-row gap-2">
                      {/* LinkedIn Link Button - Only show when not verified */}
                      {!isLinkedInVerified && (
                        <button
                          onClick={handleLinkedInVerify}
                          disabled={isVerifyingLinkedIn}
                          className="flex flex-row items-center justify-center gap-2 rounded-md bg-[#0A66C2] p-3 text-white shadow-md hover:bg-[#004182] disabled:opacity-50"
                        >
                          {isVerifyingLinkedIn ? (
                            <>
                              <Icons.loader className="h-4 w-4 animate-spin" />
                              <span className="hidden sm:inline">
                                Linking...
                              </span>
                            </>
                          ) : (
                            <>
                              <Icons.linkedin size={15} />
                              <span className="hidden sm:inline">
                                Link LinkedIn
                              </span>
                            </>
                          )}
                        </button>
                      )}

                      <button
                        onClick={() => {
                          router.push(siteConfig.page.editProfile.href)
                        }}
                        className="flex flex-row items-center justify-center gap-2 rounded-md bg-white p-3 text-slate-500 shadow-md"
                      >
                        <Icons.pencil size={15} />
                        <span className="hidden sm:inline">
                          {t("profile.view.edit_profile")}
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-row items-end gap-4">
                  {industry && (
                    <div className="flex flex-row items-center gap-2">
                      <Icons.industry className="text-indigo-600" /> {industry}
                    </div>
                  )}

                  {typeof yearOfExperience === "number" && (
                    <div className="flex flex-row items-center gap-2">
                      <Icons.yearsOfExperience className="text-indigo-600" />
                      {t("general.year_of_experience_count", {
                        count: yearOfExperience,
                      })}
                    </div>
                  )}
                  {location && (
                    <div className="flex flex-row items-center gap-2">
                      <Icons.location className="text-indigo-600" />
                      <span>{location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile */}
            <div className="flex w-full flex-row  md:hidden">
              <div className="flex flex-col">
                <div className="flex-row\ flex">
                  <div className="w-44" />
                  <div className="flex w-full flex-row justify-end gap-2 px-4">
                    {isReferer && <ReferrerBadge />}
                    {isReferee && <RefereeBadge />}
                  </div>
                </div>

                <div className="mt-16 flex flex-wrap items-center justify-start text-2xl font-semibold">
                  {professionalInfo.map((i, index) => (
                    <React.Fragment key={index}>
                      <span />
                      <span>{i}</span>
                    </React.Fragment>
                  ))}
                </div>
                <div className="flex flex-row items-center gap-3">
                  <h5 className="text-lg font-semibold text-slate-400">
                    {username}
                  </h5>

                  {/* Show verified badge next to username - Mobile */}
                  {isLinkedInVerified && (
                    <LinkedInBadge
                      name={linkedInVerification?.name}
                      picture={linkedInVerification?.picture}
                      onUnlink={
                        isViewingOwnProfile ? handleLinkedInUnlink : undefined
                      }
                      isUnlinking={isUnlinkingLinkedIn}
                    />
                  )}
                </div>

                <div className="mt-4 flex flex-col items-start gap-4">
                  {industry && (
                    <div className="flex flex-row items-center gap-2">
                      <Icons.industry className="text-indigo-600" /> {industry}
                    </div>
                  )}

                  {typeof yearOfExperience === "number" && (
                    <div className="flex flex-row items-center gap-2">
                      <Icons.yearsOfExperience className="text-indigo-600" />
                      {t("general.year_of_experience_count", {
                        count: yearOfExperience,
                      })}
                    </div>
                  )}
                  {location && (
                    <div className="flex flex-row items-center gap-2">
                      <Icons.location className="text-indigo-600" />
                      <span>{location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse justify-between p-4 md:flex-row md:gap-10 md:p-12">
          {/* introduction */}

          <div className="mt-8 w-full md:mt-0 md:w-1/2">
            <h1 className="text-xl font-semibold text-slate-500">
              {t("profile.view.introduction")}
            </h1>

            <p className="border-1 mt-4 min-h-max overflow-hidden whitespace-pre-line break-words rounded-lg bg-white p-8">
              {description}
            </p>
          </div>

          <div className="w-full md:w-1/2  ">
            {/* Community */}

            <div>
              <h1 className="mt-8 text-xl font-semibold text-slate-500 md:mt-0">
                {t("profile.view.community")}
              </h1>

              <div className="border-1 mt-4 flex flex-row items-center justify-around rounded-lg bg-white p-8">
                <div className="flex flex-col gap-2  md:flex-row ">
                  <div className="w-fit rounded-xl bg-indigo-50 p-4">
                    <Icons.coffee className="text-indigo-600" size={40} />
                  </div>

                  <div className="h-18 flex flex-col justify-between">
                    <div className="flex grow items-center justify-center">
                      <p className="text-3xl font-semibold">{requestCount}</p>
                    </div>
                    <p className="text-center text-xs text-indigo-400">
                      Coffee Chat
                    </p>
                  </div>
                </div>

                <div className="flex flex-col  gap-2  md:flex-row ">
                  <div className="w-fit rounded-xl bg-amber-50 p-4">
                    <Icons.clipboard className="text-amber-600" size={40} />
                  </div>

                  <div className="h-18 flex flex-col justify-between">
                    <div className="flex grow items-center justify-center">
                      <p className="text-3xl font-semibold">{postCount}</p>
                    </div>
                    <p className="text-center text-xs text-amber-400">
                      {t("general.post")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social */}

            <div className="mt-12">
              <h1 className="text-xl font-semibold text-slate-500">
                {t("profile.section.social_links")}
              </h1>
              <div className="mt-8 flex flex-row justify-center gap-8 md:justify-start">
                {socialLinks.map((s, index) => (
                  <SocialIconWithTooltip
                    type={s.type}
                    url={s.url}
                    name={s.name}
                    key={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20 md:mt-0" />
      <div className="fixed bottom-0 h-20 w-screen bg-white px-4 py-2">
        <div
          className={cn(
            "flex  h-full items-center justify-center gap-2  md:justify-end",
            (!showPostHistoryButton || !showContactButton) && "justify-end"
          )}
        >
          {slug && showPostHistoryButton && (
            <Button
              size={"lg"}
              variant={"outline"}
              className="w-52 gap-2 border-slate-600 text-base font-medium text-slate-600"
              onClick={() => {
                router.push(`${siteConfig.page.postHistory.href}/${slug}`)
              }}
            >
              <Icons.clipboard size={16} />
              <p className="shrink-0">{t("general.post_history")}</p>
            </Button>
          )}

          {slug && (
            <Button
              size={"lg"}
              variant={"outline"}
              className="w-52 gap-2 border-slate-600 text-base font-medium text-slate-600"
              onClick={() => {
                router.push(`${siteConfig.page.jobJourneyHistory.href}/${slug}`)
              }}
            >
              <Icons.briefcase size={16} />
              <p className="shrink-0">{t("page.job_journey_history")}</p>
            </Button>
          )}

          {isViewingOwnProfile && (
            <Button
              className="flex w-52   justify-center gap-2  border-destructive text-destructive hover:bg-destructive hover:text-white "
              onClick={handleSignOut}
              variant={"base"}
              size={"lg"}
            >
              <Icons.logOut size={18} />
              {t("general.sign_out")}
            </Button>
          )}

          {showContactButton && !isViewingOwnProfile && (
            <ContactButton
              username={username || "?"}
              toUuid={slug}
              messageType={EMessageType.REFERRAL}
              receiverType={EReferralType.REFEREE}
              buttonClassName="w-52 gap-2 h-11 bg-indigo-600 text-base font-medium text-white"
              showIcon
            />
          )}
        </div>
      </div>

      {/* LinkedIn Unlink Confirmation Dialog */}
      <Dialog open={showUnlinkDialog} onOpenChange={setShowUnlinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlink LinkedIn Account?</DialogTitle>
            <DialogDescription>
              Are you sure you want to unlink your LinkedIn account? This will
              remove your LinkedIn verification badge.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUnlinkDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmUnlink}
              disabled={isUnlinkingLinkedIn}
            >
              {isUnlinkingLinkedIn ? (
                <>
                  <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                  Unlinking...
                </>
              ) : (
                "Yes, Unlink"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ViewProfileTemplate
