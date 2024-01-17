"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import LinkTooltip from "@/modules/profile/components/tool-tip/link"
import { supabase } from "@/utils/services/supabase/config"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import useUserStore from "@/hooks/state/user/store"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import BaseAvatar from "@/components/customized-ui/avatars/base"
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
  setIsEditMode: (value: boolean) => void
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
  setIsEditMode,
  industry,
  isReferer,
  isReferee,
  slug,
}) => {
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
        title: "登出成功！",
      })
    } catch (err) {
      return toast({
        title: "登出出事！",
        description: "好似有啲錯誤，如果試多幾次都係咁，請聯絡我🙏🏻",
        variant: "destructive",
      })
    }
  }
  return (
    <div className="flex h-full flex-col items-center justify-between">
      <div className="flex w-full flex-col gap-y-2">
        <div className="gap-2p-4 mx-8 flex w-full flex-row justify-end">
          {socialMediaUrl && <LinkTooltip url={socialMediaUrl} />}
          <Link
            className={cn(buttonVariants({ variant: "ghost" }), "gap-2")}
            href={`${siteConfig.page.postHistory.href}/${slug}`}
          >
            <Icons.history />
            {siteConfig.page.postHistory.name}
          </Link>
          {isViewingOwnProfile && (
            <Button
              onClick={() => {
                setIsEditMode(true)
              }}
              className="gap-2"
            >
              <Icons.pencil />
              編輯
            </Button>
          )}
        </div>

        <div className="flex justify-center">
          <BaseAvatar
            url={photoUrl}
            alt={username}
            fallBack={username && username[0]}
            size="large"
          />
        </div>

        <h5 className="text-center text-2xl font-semibold">{username}</h5>

        <div className="flex flex-col text-center">
          {jobTitle && <h5 className="font-semibold">{jobTitle}</h5>}
          {company && <h5 className="font-semibold ">{company}</h5>}
        </div>

        <li className="flex w-full flex-wrap justify-center gap-2">
          {country && (
            <ul>
              <Badge> {country}</Badge>
            </ul>
          )}

          {province && (
            <ul>
              <Badge> {province}</Badge>
            </ul>
          )}
          {city && (
            <ul>
              <Badge> {city}</Badge>
            </ul>
          )}
        </li>
        <li className="flex w-full flex-wrap justify-center gap-2">
          {industry && (
            <ul>
              <Badge> {industry}</Badge>
            </ul>
          )}

          {typeof yearOfExperience === "number" && yearOfExperience >= 0 && (
            <ul>
              <Badge> {yearOfExperience}年經驗</Badge>
            </ul>
          )}
        </li>

        <div className="mt-8 flex w-full justify-center gap-2">
          <div className="flex flex-row items-center gap-2">
            <Checkbox checked={isReferer} />
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              推薦人
            </label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox checked={isReferee} />
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              受薦人
            </label>
          </div>
        </div>

        <div className="container mt-8 text-center">
          <div className="inline-block whitespace-pre-wrap break-all text-left md:break-words">
            {description}
          </div>
        </div>
      </div>

      {isViewingOwnProfile && (
        <Button
          className="mt-20 flex w-full cursor-pointer justify-center md:w-1/2 "
          onClick={handleSignOut}
          variant={"destructive"}
        >
          登出
        </Button>
      )}
    </div>
  )
}

export default ViewProfileTemplate
