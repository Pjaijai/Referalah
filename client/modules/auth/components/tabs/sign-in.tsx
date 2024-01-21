import React from "react"
import OneTimePasswordSignInForm from "@/modules/auth/components/forms/sign-in/one-time-password"
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
        <TabsTrigger value="oneTimePassword" className="w-full">
          {t("general.one_time_password")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="password">
        <PasswordSignInForm />
      </TabsContent>
      <TabsContent value="oneTimePassword">
        <OneTimePasswordSignInForm />
      </TabsContent>
    </Tabs>
  )
}

export default SignInTab
