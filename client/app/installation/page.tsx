import InstallationTabs from "@/modules/installation/components/tabs/installation"
import { pageData } from "@/modules/installation/data"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.installation.metadata

const InstallationPage = () => {
  return (
    <CommonPageLayout title={siteConfig.page.installation.name}>
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
    </CommonPageLayout>
  )
}

export default InstallationPage
