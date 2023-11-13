import AuthPageTemplate from "@/modules/auth/template"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.auth.metadata

const AuthPage = () => {
  return (
    <CommonPageLayout>
      <AuthPageTemplate />
    </CommonPageLayout>
  )
}

export default AuthPage
