"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "開Post",
    href: "/post/create",
    description:
      "你公司請人又想搵香港人？網上睇到份工又想人幫手？係到開post，等人聯絡你。",
  },
  {
    title: "工作(推薦區)",
    href: "/post/referer",
    description: "係到搵有乜工搵人推薦。",
  },
  {
    title: "工作(受薦區)",
    href: "/post/referee",
    description: "係到搵有乜人需要幫手。",
  },
]

export function BaseNavigationMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm md:text-lg flex items-center flex-row gap-2">
            🙋 人脈
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex flex-col w-[200px]">
              <ListItem href="/profile" title="成為推薦人/受薦人">
                去個人檔案剔翻該選項，同埋填翻相認資料就OK啦！幫得一個得一個🙏🏻
              </ListItem>
              <ListItem href="/referer" title="搵推薦人">
                想搵人推薦你入去？係到搵下啦！
              </ListItem>
              <ListItem href="/referee" title="搵受薦人">
                想搵人材？係到睇下有冇合適嘅人啦！
              </ListItem>
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
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
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
