import AuthPageTemplate from "@/modules/auth/template"

import CommonPageLayout from "@/components/layouts/common"
import { siteConfig } from "@/config/site.ts";

export function generateMetadata() {
    return siteConfig.page.auth.metadata
}

const AuthPage = () => {
  return (
    <CommonPageLayout>
      <AuthPageTemplate />
    </CommonPageLayout>
  )
}

export default AuthPage
