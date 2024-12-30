"use client"

import React from "react"
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
import { useToast } from "@/components/ui/use-toast"
import BaseAvatar from "@/components/customized-ui/avatars/base"
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
  country: string | null
  province: string | null
  industry: string | null
  city: string | null
  socialLinks: ISocialLinksData[]
  isReferer: boolean
  isReferee: boolean
  slug: string
  requestCount: number
  postCount: number
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
  country,
  province,
  city,
  socialLinks,
  industry,
  isReferer,
  isReferee,
  slug,
  requestCount,
  postCount,
}) => {
  const t = useI18n()
  const userUuid = useUserStore((state) => state.uuid)
  const isViewingOwnProfile = slug === userUuid
  const userState = useUserStore((state) => state)
  const { toast } = useToast()

  const router = useRouter()
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

  const location = [city, province, country].filter(Boolean)

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
              <button
                onClick={() => {
                  router.push(siteConfig.page.editProfile.href)
                }}
                className="flex flex-row items-center justify-center gap-2 rounded-md bg-white p-3 text-slate-500 shadow-md"
              >
                <Icons.pencil size={15} />
                <span>{t("profile.view.edit_profile")}</span>
              </button>
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
                      </div>
                    </div>

                    <h5 className="text-lg font-semibold text-slate-400">
                      {username}
                    </h5>
                  </div>

                  {isViewingOwnProfile && (
                    <button
                      onClick={() => {
                        router.push(siteConfig.page.editProfile.href)
                      }}
                      className="flex flex-row items-center justify-center gap-2 rounded-md bg-white p-3 text-slate-500 shadow-md"
                    >
                      <Icons.pencil size={15} />
                      <span>{t("profile.view.edit_profile")}</span>
                    </button>
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
                  {location.length > 0 && (
                    <div className="flex flex-row items-center gap-2">
                      <Icons.location className="text-indigo-600" />

                      <div className="flex flex-row">
                        {location.map((lo, index) => (
                          <React.Fragment key={index}>
                            {index > 0 && <>,</>}
                            <span className="ml-1">{lo}</span>
                          </React.Fragment>
                        ))}
                      </div>
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
                <h5 className="text-lg font-semibold text-slate-400">
                  {username}
                </h5>

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
                  {location.length > 0 && (
                    <div className="flex flex-row items-center gap-2">
                      <Icons.location className="text-indigo-600" />

                      <div className="flex flex-row">
                        {location.map((lo, index) => (
                          <React.Fragment key={index}>
                            {index > 0 && <>,</>}
                            <span className="ml-1">{lo}</span>
                          </React.Fragment>
                        ))}
                      </div>
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

            <p className="border-1 mt-4 min-h-max overflow-hidden break-words rounded-lg bg-white p-8">
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
          {showPostHistoryButton && (
            <Button
              size={"lg"}
              variant={"outline"}
              className="w-52 gap-2 border-slate-600 text-base font-medium text-slate-600"
              onClick={() => {
                router.push(`${siteConfig.page.postHistory.href}/${userUuid}`)
              }}
            >
              <Icons.clipboard size={16} />
              <p className="shrink-0">{t("general.post_history")}</p>
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
    </>
  )
}

export default ViewProfileTemplate
