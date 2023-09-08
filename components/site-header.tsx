"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/utils/services/supabase/config"

import { siteConfig } from "@/config/site"
import useUserStore from "@/hooks/state/user/useUserStore"
import { Button, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  const userState = useUserStore((state) => state)
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      userState.reSetUser()
    } catch (err) {}
  }

  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.twitter className="h-5 w-5 fill-current" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link>

            {userState.isSignIn ? (
              <Button onClick={handleSignOut}> sign out</Button>
            ) : (
              <Button
                onClick={() => {
                  router.push("/auth")
                }}
              >
                {" "}
                sign in
              </Button>
            )}

            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
