import BaseAvatar from "@/components/customized-ui/avatars/base"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { siteConfig } from "@/config/site"
import useUserStore from "@/hooks/state/user/useUserStore"
import { supabase } from "@/utils/services/supabase/config"
import Link from "next/link"

import React from "react"

const nav = [
  { href:   siteConfig.page.profile.href, title: "用戶檔案" },
  { href: siteConfig.page.referrer.href , title: "推薦人" },
  { href:  siteConfig.page.referee.href, title: "受薦人" },
  { href: siteConfig.page.createPost.href, title: "開Post" },
  { href: siteConfig.page.referrerPost.href, title: "工搵人" },
  { href:  siteConfig.page.refereePost.href, title: "人搵工" },
]

const UserDropDownMenu = () => {
  const user = useUserStore((state) => state)
  const userState = useUserStore((state) => state)
  const { toast } = useToast()
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()

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
        {nav.map((n) => {
          return (
            <DropdownMenuItem>
              <Link
                href={n.href}
               
                className="flex items-center justify-center  space-x-2 w-full"
              >
                {n.title}
              </Link>
            </DropdownMenuItem>
          )
        })}

        <DropdownMenuItem
          className="flex justify-center cursor-pointer"
          onClick={handleSignOut}
        >
          登出
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropDownMenu
