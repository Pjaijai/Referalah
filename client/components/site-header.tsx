"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import NotificationPopover from "@/modules/notification/components/popover/notification"
import useNotification from "@/modules/notification/hooks/notification"
import { useI18n } from "@/utils/services/internationalization/client"

import { siteConfig } from "@/config/site"
import useUserStore from "@/hooks/state/user/store"
import { Button } from "@/components/ui/button"
import BaseAvatar from "@/components/customized-ui/avatars/base"
import LocaleDropDownMenu from "@/components/customized-ui/drop-down-menu/locale"
import BellIconWithDot from "@/components/customized-ui/icons/bell-with-dot"
import { BaseNavigationMenu } from "@/components/customized-ui/navigation-menu/base"
import { MobileNavigationMenu } from "@/components/customized-ui/navigation-menu/mobile"
import { MainNav } from "@/components/main-nav"

// import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  const t = useI18n()
  const user = useUserStore((state) => state)
  const router = useRouter()
  const { list: notificationList } = useNotification(10)

  const hasUnseenMessages = notificationList.some((item) => !item.is_seen)

  return (
    <header className=" top-0 z-40 w-full border-b">
      <div className="flex h-16 items-center justify-between space-x-4 p-2 sm:space-x-0  md:p-4">
        <div className="flex items-center ">
          <MobileNavigationMenu className="mr-1 md:hidden" />

          <div className="flex-1">
            <MainNav />
          </div>
        </div>
        <div className="hidden w-full flex-1 shrink-0 justify-center  md:flex">
          <BaseNavigationMenu />
        </div>

        <div className="flex items-center justify-end space-x-4">
          <nav className="flex items-center gap-2">
            <LocaleDropDownMenu />

            {/* TODO: Theme toggle */}
            {/* 
            <div className="hidden md:block">
              <ThemeToggle />
            </div> */}

            {/* <Icons.bell
              className="block cursor-pointer fill-black md:hidden"
              onClick={() => {
                router.push("notification")
              }}
            /> */}

            <BellIconWithDot
              showDot={hasUnseenMessages}
              onClick={() => {
                router.push("notification")
              }}
              className="block  md:hidden"
              iconClassName="cursor-pointer"
            />
            <NotificationPopover />

            {user.isSignIn ? (
              <Link href={`${siteConfig.page.profile.href}/${user.uuid}`}>
                <div className="flex flex-row items-center gap-1">
                  <BaseAvatar
                    fallBack={user.username ? user.username[0] : ""}
                    url={user.photoUrl || undefined}
                    alt={user.username ? user.username[0] : ""}
                  />
                  <span className="hidden md:block">{user.username}</span>
                </div>
              </Link>
            ) : (
              <Button
                onClick={() => {
                  router.push(`${siteConfig.page.signIn.href}`)
                }}
              >
                {t("page.sign_in")}
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
