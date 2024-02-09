"use client"

import React from "react"
import InstallationTabs from "@/modules/installation/components/tabs/installation"
import { useI18n } from "@/utils/services/internationalization/client"

const InstallationPageTemplate = () => {
  const t = useI18n()
  const pageData = [
    {
      section: "intro",
      title: "",
      content: [t("pwa.intro")],
    },
    {
      section: "what",
      title: t("pwa.what_is_pwa.title"),
      content: [t("pwa.what_is_pwa")],
    },
    {
      section: "how",
      content: [t("pwa.how_to_install")],
    },
  ]
  return (
    <article className="mx-auto flex w-full flex-col items-start justify-center gap-8 py-8 md:w-3/4 lg:w-3/5">
      {pageData.map((x) => (
        <div
          key={x.section}
          className="flex flex-col items-start justify-center gap-2"
        >
          <h2 className="text-lg font-semibold">{x.title}</h2>
          {x.content.map((paragraph, index) => (
            <p key={`p-${index}`}>{paragraph}</p>
          ))}
        </div>
      ))}
      <InstallationTabs />
    </article>
  )
}

export default InstallationPageTemplate
