"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { siteConfig } from "@/config/site"
import useUserStore from "@/hooks/state/user/store"
import { Button } from "@/components/ui/button"
import UserDropDownMenu from "@/components/customized-ui/drop-down-menu/user"
import { BaseNavigationMenu } from "@/components/customized-ui/navigation-menu/base"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  const isUserSignIn = useUserStore((state) => state.isSignIn)
  const router = useRouter()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-center space-x-4 sm:space-x-0">
        <div className="flex-1">
          <MainNav />
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <BaseNavigationMenu />
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              aria-label="referalah-project-github"
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <Icons.github />
            </Link>

            {isUserSignIn ? (
              <UserDropDownMenu />
            ) : (
              <Button
                onClick={() => {
                  router.push(`${siteConfig.page.signIn.href}`)
                }}
              >
                登入
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
