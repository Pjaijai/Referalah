import * as React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import useUserStore from "@/hooks/state/user/store"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import MessageIcon from "@/components/customized-ui/icoins/message"
import { Icons } from "@/components/icons"

const components: { title: string; href: string; description: string }[] = [
  {
    title: siteConfig.page.createPost.name,
    href: siteConfig.page.createPost.href,
    description: "你公司請人又想搵香港人？係到貼個街招，等人聯絡你。",
  },
  {
    title: siteConfig.page.referrerPost.name,
    href: siteConfig.page.referrerPost.href,
    description: "係到搵有乜工搵人推薦。",
  },
]

export function BaseNavigationMenu() {
  const userUuid = useUserStore((state) => state.uuid)
  const isUserSignIn = useUserStore((state) => state.isSignIn)
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex flex-row items-center gap-2 text-sm md:text-lg">
            <Icons.personStanding /> 人脈
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-[200px] flex-col">
              <Link href={`${siteConfig.page.profile.href}/${userUuid}`}>
                <ListItem title="成為推薦人/受薦人">
                  去個人檔案剔翻該選項，同埋填翻相認資料就OK啦！幫得一個得一個🙏🏻
                </ListItem>
              </Link>

              <Link href={siteConfig.page.referrer.href}>
                <ListItem title="推薦人">
                  想搵人推薦你入去？係到搵下啦！
                </ListItem>
              </Link>

              <Link href={siteConfig.page.referee.href}>
                <ListItem title="受薦人">
                  想搵人材？係到睇下有冇合適嘅人啦！
                </ListItem>
              </Link>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center gap-2 text-sm md:text-lg">
            <Icons.briefcase /> 工作
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-[200px] flex-col ">
              {components.map((component) => (
                <Link href={component.href} key={component.href}>
                  <ListItem key={component.title} title={component.title}>
                    {component.description}
                  </ListItem>
                </Link>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {isUserSignIn && (
          <NavigationMenuItem>
            <Link href={siteConfig.page.chat.href}>
              <div
                className={
                  "flex h-10 w-max items-center justify-center gap-2 rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none   md:text-lg"
                }
              >
                <MessageIcon />
                對話
              </div>
            </Link>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-4 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-lg font-medium leading-none">{title}</div>
          <p className=" text-sm leading-snug text-muted-foreground ">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
