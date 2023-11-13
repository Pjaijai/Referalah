import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { supabase } from "@/utils/services/supabase/config"

import { siteConfig } from "@/config/site"
import useUserStore from "@/hooks/state/user/store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import BaseAvatar from "@/components/customized-ui/avatars/base"

const UserDropDownMenu = () => {
  const pathname = usePathname()
  const user = useUserStore((state) => state)
  const userState = useUserStore((state) => state)
  const { toast } = useToast()
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) throw error

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

  const nav = [
    {
      href: `${siteConfig.page.profile.href}/${user.uuid}`,
      title: "用戶檔案",
      hideOnLargeScreen: false,
    },
    {
      href: siteConfig.page.referrer.href,
      title: "推薦人",
      hideOnLargeScreen: true,
    },
    {
      href: siteConfig.page.referee.href,
      title: "受薦人",
      hideOnLargeScreen: true,
    },
    {
      href: siteConfig.page.createPost.href,
      title: "貼街招",
      hideOnLargeScreen: true,
    },
    {
      href: siteConfig.page.referrerPost.href,
      title: "街招",
      hideOnLargeScreen: true,
    },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex flex-row items-center gap-2">
        <BaseAvatar
          fallBack={user.username ? user.username[0] : ""}
          url={user.photoUrl || undefined}
          alt={user.username ? user.username[0] : ""}
        />
        <span>{user.username}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {nav.map((n) => (
          <DropdownMenuItem
            key={n.href}
            className={`${n.hideOnLargeScreen && "md:hidden"} ${
              pathname === "/" && n.hideOnLargeScreen && "hidden"
            }`}
          >
            <Link
              href={n.href}
              className="flex w-full items-center  justify-center space-x-2"
            >
              {n.title}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuItem
          className="flex cursor-pointer justify-center text-red-500"
          onClick={handleSignOut}
        >
          登出
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropDownMenu
