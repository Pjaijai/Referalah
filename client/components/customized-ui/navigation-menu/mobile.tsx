"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/utils/services/internationalization/client"

import { siteConfig } from "@/config/site"
import useUserStore from "@/hooks/state/user/store"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import MessageIcon from "@/components/customized-ui/icons/message"
import { Icons } from "@/components/icons"
import { ThemeToggleMobile } from "@/components/theme-toggle-mobile"

interface MobileNavigationMenuProps {
  className?: string
}

export function MobileNavigationMenu({ className }: MobileNavigationMenuProps) {
  const t = useI18n()
  const { isSignIn } = useUserStore((state) => state)

  const connectionLinks = useMemo(() => {
    const links = [
      {
        title: t("page.search_member"),
        url: siteConfig.page.searchMember.href,
      },
    ]

    if (!isSignIn) {
      links.unshift({
        title: t("nav.become_member_title"),
        url: `${siteConfig.page.signUp.href}`,
      })
    }

    return links
  }, [isSignIn])

  const workLinks = [
    { title: t("page.post"), url: siteConfig.page.searchPost.href },
    { title: t("page.create_post"), url: siteConfig.page.createPost.href },
  ]

  const router = useRouter()
  const handleLinkOnClick = (url: string) => {
    router.push(url)
  }

  return (
    <div className={className}>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost">
            <Icons.menu />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex flex-col justify-between px-5 py-4"
        >
          <div>
            <SheetHeader>
              <SheetTitle className="text-left">Referalah</SheetTitle>
            </SheetHeader>
            <Accordion
              type="multiple"
              className="w-full"
              defaultValue={["connection", "work"]}
            >
              <AccordionItem value="connection">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Icons.people />
                    {t("general.connection")}
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="flex flex-col gap-3 pl-7">
                    {connectionLinks.map((link) => (
                      <SheetClose asChild key={link.title}>
                        <div
                          onClick={() => handleLinkOnClick(link.url)}
                          className="hover:cursor-pointer"
                        >
                          {link.title}
                        </div>
                      </SheetClose>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="work">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Icons.work />
                    {t("page.post")}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-3 pl-7">
                    {workLinks.map((link) => (
                      <SheetClose asChild key={link.title}>
                        <div
                          onClick={() => handleLinkOnClick(link.url)}
                          className="hover:cursor-pointer"
                        >
                          {link.title}
                        </div>
                      </SheetClose>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              {isSignIn && (
                <SheetClose asChild>
                  <div
                    onClick={() => handleLinkOnClick(siteConfig.page.chat.href)}
                    className="flex items-center gap-2 py-4 font-bold hover:cursor-pointer"
                  >
                    <MessageIcon />
                    {t("page.chat")}
                  </div>
                </SheetClose>
              )}
            </Accordion>
          </div>

          {/* TODO: Theme toggle */}
          {/* <SheetFooter>
            <ThemeToggleMobile />
          </SheetFooter> */}
        </SheetContent>
      </Sheet>
    </div>
  )
}
