"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import InfoCard from "@/modules/profile/components/cards/Info"
import { useI18n } from "@/utils/services/internationalization/client"
import { supabase } from "@/utils/services/supabase/config"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import useUserStore from "@/hooks/state/user/store"
import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import BaseAvatar from "@/components/customized-ui/avatars/base"
import LocationDisplay from "@/components/customized-ui/info-display/location"
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
  socialMediaUrl: string | null
  isReferer: boolean
  isReferee: boolean
  slug: string
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
  socialMediaUrl,
  industry,
  isReferer,
  isReferee,
  slug,
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
  return (
    <>
      <div className="relative flex h-full flex-col items-center justify-between rounded-lg border border-muted p-6 pb-12">
        {isViewingOwnProfile && (
          <button
            onClick={() => {
              router.push(siteConfig.page.editProfile.href)
            }}
            className="absolute right-4 flex w-fit items-center justify-center rounded-full border bg-slate-50 p-3 dark:bg-black"
          >
            <Icons.pencil size={15} />
          </button>
        )}
        <div className="flex w-full flex-col gap-y-2">
          <div className="flex justify-center">
            <BaseAvatar
              url={photoUrl}
              alt={username}
              fallBack={username && username[0]}
              size="large"
            />
          </div>

          <h5 className="text-center text-3xl font-semibold ">{username}</h5>

          <div className="flex flex-row justify-center gap-2 text-center text-xl">
            {jobTitle && <h5>{jobTitle}</h5>}
            {company && <h5>@</h5>}
            {company && <h5>{company}</h5>}
          </div>

          <li className="flex w-full flex-wrap justify-center gap-2">
            <LocationDisplay
              city={city}
              province={province}
              country={country}
              className="text-lg"
            />
          </li>

          <div className="mt-4 flex w-full items-center justify-center ">
            {socialMediaUrl && (
              <Link
                rel="noopener noreferrer nofollow"
                target="_blank"
                href={socialMediaUrl}
                className={
                  "flex w-fit items-center justify-center rounded-full border p-3"
                }
              >
                <Icons.link size={18} />
              </Link>
            )}
          </div>

          <div className="mt-2 flex w-full items-center justify-center">
            <Link
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full max-w-lg"
              )}
              href={`${siteConfig.page.postHistory.href}/${slug}`}
            >
              {t("page.post_history")}
            </Link>
          </div>

          <Separator className="mt-8" />

          <h2 className="mt-8 text-center text-xl">{t("general.user_type")}</h2>

          <div className="mt-2 flex w-full justify-center gap-2">
            <InfoCard>
              <Checkbox checked={isReferer} className="bg-white" />
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t("general.referrer")}
              </label>
              <p className="text-center text-sm text-muted-foreground">
                {t("profile.form.is_referrer_description")}
              </p>
            </InfoCard>

            <InfoCard>
              <Checkbox checked={isReferee} />
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t("general.talent")}
              </label>
              <p className="text-center text-sm text-muted-foreground">
                {t("profile.form.is_referee_description")}
              </p>
            </InfoCard>
          </div>

          <h2 className="mt-8 text-center text-xl">
            {t("general.work_experience")}
          </h2>
          <div className="mt-2 flex  w-full justify-center  gap-2">
            <InfoCard>
              <Icons.briefcase />
              <p className="text-center">{industry}</p>
            </InfoCard>

            {typeof yearOfExperience === "number" && yearOfExperience >= 0 && (
              <InfoCard>
                <Icons.calendarDays />
                <p className="text-center">
                  {t("general.year", {
                    count: yearOfExperience,
                  })}
                </p>
              </InfoCard>
            )}
          </div>

          <h2 className="mt-8 text-center text-xl">
            {t("general.personal_profile")}
          </h2>
          <div className="container mt-8 text-center">
            <div className="inline-block whitespace-pre-wrap break-all text-left text-slate-900 dark:text-slate-50 md:break-words">
              {description}
            </div>
          </div>
        </div>
      </div>
      {isViewingOwnProfile && (
        <div className="mt-2 flex w-full items-center justify-center ">
          <Button
            className="mt-4 flex w-full max-w-lg cursor-pointer justify-center gap-4  text-destructive hover:text-destructive dark:border-2 dark:border-destructive dark:font-semibold md:w-1/2"
            onClick={handleSignOut}
            variant={"outline"}
          >
            <Icons.logOut size={18} />
            {t("general.sign_out")}
          </Button>
        </div>
      )}
    </>
  )
}

export default ViewProfileTemplate
