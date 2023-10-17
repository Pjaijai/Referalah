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

const components: { title: string; href: string; description: string }[] = [
  {
    title: "貼街招",
    href: siteConfig.page.createPost.href,
    description:
      "你公司請人又想搵香港人？網上睇到份工又想人幫手？係到貼個街招，等人聯絡你。",
  },
  {
    title: "工搵人",
    href: siteConfig.page.referrerPost.href,
    description: "係到搵有乜工搵人推薦。",
  },
  {
    title: "人搵工",
    href: siteConfig.page.refereePost.href,
    description: "係到搵有乜人需要幫手。",
  },
]

export function BaseNavigationMenu() {
  const userUuid = useUserStore((state) => state.uuid)
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm md:text-lg flex items-center flex-row gap-2">
            🙋 人脈
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex flex-col w-[200px]">
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
          <NavigationMenuTrigger className="text-sm md:text-lg flex items-center gap-2">
            💼 工作
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex flex-col w-[200px] ">
              {components.map((component) => (
                <Link href={component.href}>
                  <ListItem key={component.title} title={component.title}>
                    {component.description}
                  </ListItem>
                </Link>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
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
