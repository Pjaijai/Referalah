import React from "react"
import MagicLinkSignInForm from "@/modules/auth/components/forms/sign-in/magic-link"
import PasswordSignInForm from "@/modules/auth/components/forms/sign-in/password"
import { useI18n } from "@/utils/services/internationalization/client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const SignInTab = () => {
  const t = useI18n()
  return (
    <Tabs defaultValue="password" className="mt-8 h-fit w-full md:w-[400px]">
      <TabsList className="w-full">
        <TabsTrigger value="password" className="w-full">
          {t("general.password")}
        </TabsTrigger>
        <TabsTrigger value="magicLink" className="w-full">
          {t("general.magic_link")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="password">
        <PasswordSignInForm />
      </TabsContent>
      <TabsContent value="magicLink">
        <MagicLinkSignInForm />
      </TabsContent>
    </Tabs>
  )
}

export default SignInTab
