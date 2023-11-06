import AuthPageTemplate from "@/modules/auth/template"

import CommonPageLayout from "@/components/layouts/common"
import { siteConfig } from "@/config/site";

export const metadata = siteConfig.page.auth.metadata


const AuthPage = () => {
  return (
    <CommonPageLayout>
      <AuthPageTemplate />
    </CommonPageLayout>
  )
}

export default AuthPage
