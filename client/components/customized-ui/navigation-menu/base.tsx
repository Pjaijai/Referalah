import * as React from "react"
import Link from "next/link"
import { useI18n } from "@/utils/services/internationalization/client"

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
import MessageIcon from "@/components/customized-ui/icons/message"
import { Icons } from "@/components/icons"

export function BaseNavigationMenu() {
  const t = useI18n()
  const userUuid = useUserStore((state) => state.uuid)
  const isUserSignIn = useUserStore((state) => state.isSignIn)

  const components: { title: string; href: string; description: string }[] = [
    {
      title: t("page.create_post"),
      href: siteConfig.page.createPost.href,
      description: t("nav.create_post.description"),
    },
    {
      title: t("page.post"),
      href: siteConfig.page.searchPost.href,
      description: t("nav.referrer_post.description"),
    },
  ]

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex flex-row items-center gap-2 text-sm md:text-lg">
            <Icons.personStanding /> {t("general.connection")}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-[400px] flex-col">
              <Link href={`${siteConfig.page.profile.href}/${userUuid}`}>
                <ListItem title={t("nav.become_referrer_or_referrer_title")}>
                  {t("nav.become_referrer_or_referrer_description")}
                </ListItem>
              </Link>

              <Link href={siteConfig.page.referrer.href}>
                <ListItem title={t("general.referrer")}>
                  {t("nav.referrer.description")}
                </ListItem>
              </Link>

              <Link href={siteConfig.page.talent.href}>
                <ListItem title={t("general.talent")}>
                  {t("nav.referee.description")}
                </ListItem>
              </Link>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center gap-2 text-sm md:text-lg">
            <Icons.briefcase /> {t("general.post")}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-[400px] flex-col ">
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
                <MessageIcon variant="outlined" />
                {t("page.chat")}
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
