"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { getFeatureFlag } from "@/utils/services/firebase/config"
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import MessageIconWithDot from "@/components/customized-ui/icons/message-with-dot"
import { Icons } from "@/components/icons"

interface MobileNavigationMenuProps {
  className?: string
}

interface NavLink {
  title: string
  url: string
  requiresAuth?: boolean
}

interface NavSection {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  links: NavLink[]
}

export function MobileNavigationMenu({ className }: MobileNavigationMenuProps) {
  const t = useI18n()
  const router = useRouter()
  const { isSignIn } = useUserStore((state) => ({
    isSignIn: state.isSignIn,
  }))
  const [showJobJourney, setShowJobJourney] = useState(false)
  useEffect(() => {
    const checkFeatureFlag = async () => {
      const isJobJourneyEnabled = await getFeatureFlag("is_job_journey_enabled")

      if (isJobJourneyEnabled) {
        setShowJobJourney(isJobJourneyEnabled)
      }
    }

    checkFeatureFlag()
  })

  const navSections: NavSection[] = useMemo(() => {
    const list = [
      {
        id: "connection",
        title: t("general.connection"),
        icon: Icons.people,
        links: [
          !isSignIn && {
            title: t("nav.become_member_title"),
            url: siteConfig.page.signUp.href,
          },
          {
            title: t("page.search_member"),
            url: siteConfig.page.searchMember.href,
          },
        ].filter(Boolean) as NavLink[],
      },
      {
        id: "post",
        title: t("page.post"),
        icon: Icons.work,
        links: [
          {
            title: t("page.post"),
            url: siteConfig.page.searchPost.href,
          },
          {
            title: t("page.create_post"),
            url: siteConfig.page.createPost.href,
            requiresAuth: true,
          },
        ],
      },
    ]

    if (showJobJourney) {
      list.push({
        id: "jobJourney",
        title: t("page.job_journey"),
        icon: Icons.scroll as any,
        links: [
          {
            title: t("page.job_journey"),
            url: siteConfig.page.searchJobJourney.href,
          },
          {
            title: t("page.create_job_journey"),
            url: siteConfig.page.createJobJourney.href,
            requiresAuth: true,
          },
        ],
      })
    }

    return list
  }, [isSignIn, t, showJobJourney])

  const handleLinkClick = (url: string) => {
    router.push(url)
  }

  const renderNavLink = (link: NavLink) => {
    if (link.requiresAuth && !isSignIn) return null
    return (
      <SheetClose asChild key={link.title}>
        <div
          onClick={() => handleLinkClick(link.url)}
          className="hover:cursor-pointer"
        >
          {link.title}
        </div>
      </SheetClose>
    )
  }

  return (
    <div className={className}>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost">
            <Icons.menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col px-5 py-4">
          <SheetHeader>
            <SheetTitle className="text-left">Referalah</SheetTitle>
          </SheetHeader>
          <Accordion
            type="multiple"
            className="w-full"
            defaultValue={navSections.map((section) => section.id)}
          >
            {navSections.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <section.icon
                      className={
                        section.id === "jobJourney"
                          ? "fill-black text-black"
                          : ""
                      }
                    />
                    {section.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-3 pl-7">
                    {section.links.map(renderNavLink)}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
            {isSignIn && (
              <SheetClose asChild>
                <div
                  onClick={() => handleLinkClick(siteConfig.page.chat.href)}
                  className="flex items-center gap-2 py-4 font-bold hover:cursor-pointer"
                >
                  <Icons.chat />
                  {t("page.chat")}
                </div>
              </SheetClose>
            )}
          </Accordion>
        </SheetContent>
      </Sheet>
    </div>
  )
}
