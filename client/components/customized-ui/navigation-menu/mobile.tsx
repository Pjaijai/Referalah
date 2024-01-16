"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

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
import { Icons } from "@/components/icons"
import { ThemeToggleMobile } from "@/components/theme-toggle-mobile"

interface MobileNavigationMenuProps {
  className?: string
}

export function MobileNavigationMenu({ className }: MobileNavigationMenuProps) {
  const userUuid = useUserStore((state) => state.uuid)

  const connectionLinks = [
    { title: "推薦人", url: siteConfig.page.referrer.href },
    { title: "受薦人", url: siteConfig.page.referee.href },
    {
      title: "成為推薦人/受薦人",
      url: `${siteConfig.page.profile.href}/${userUuid}`,
    },
  ]

  const workLinks = [
    { title: "街招", url: siteConfig.page.referrerPost.href },
    { title: "貼街招", url: siteConfig.page.createPost.href },
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
                    人脈
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
                    工作
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
              {/* TO-FIX */}
              <SheetClose asChild>
                <div
                  onClick={() =>
                    handleLinkOnClick(siteConfig.page.referrerPost.href)
                  }
                  className="flex items-center gap-2 py-4 font-bold hover:cursor-pointer"
                >
                  <Icons.chat />
                  對話
                </div>
              </SheetClose>
            </Accordion>
          </div>
          <SheetFooter>
            <ThemeToggleMobile />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
