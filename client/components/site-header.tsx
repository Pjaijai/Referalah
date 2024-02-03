"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useI18n } from "@/utils/services/internationalization/client"

import { siteConfig } from "@/config/site"
import useUserStore from "@/hooks/state/user/store"
import { Button } from "@/components/ui/button"
import BaseAvatar from "@/components/customized-ui/avatars/base"
import LocaleDropDownMenu from "@/components/customized-ui/drop-down-menu/locale"
import MessageIcon from "@/components/customized-ui/icons/message"
import { BaseNavigationMenu } from "@/components/customized-ui/navigation-menu/base"
import { MobileNavigationMenu } from "@/components/customized-ui/navigation-menu/mobile"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  const t = useI18n()
  const user = useUserStore((state) => state)
  const router = useRouter()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between space-x-4 p-2 sm:space-x-0  md:p-4">
        <div className="flex items-center">
          <MobileNavigationMenu className="mr-1 md:hidden" />

          <div className="flex-1">
            <MainNav />
          </div>
        </div>
        <div className="hidden w-full flex-1 shrink-0 justify-center md:flex">
          <BaseNavigationMenu />
        </div>

        <div className="flex items-center justify-end space-x-4">
          <nav className="flex items-center gap-2">
            <LocaleDropDownMenu />

            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            <Link
              aria-label="referalah-project-github"
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="hidden md:block"
            >
              <Icons.github />
            </Link>

            {user.isSignIn && (
              <Link href={siteConfig.page.chat.href}>
                <MessageIcon className="block md:hidden" />
              </Link>
            )}

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
