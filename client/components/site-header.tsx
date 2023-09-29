"use client"

import UserDropDownMenu from "@/components/customized-ui/drop-down-menu/user"
import { BaseNavigationMenu } from "@/components/customized-ui/navigation-menu/base"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import useUserStore from "@/hooks/state/user/useUserStore"
import { useRouter } from "next/navigation"

export function SiteHeader() {
  const isUserSignIn = useUserStore((state) => state.isSignIn)
  const router = useRouter()

  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 justify-between sm:space-x-0">
      <MainNav />
        <div className="hidden md:flex justify-center">
          <BaseNavigationMenu />
        </div>

        <div className="flex  items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <ThemeToggle />
            {isUserSignIn ? (
              <UserDropDownMenu />
            ) : (
              <Button
                onClick={() => {
                  router.push("/auth")
                }}
              >
                登入/註冊
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
