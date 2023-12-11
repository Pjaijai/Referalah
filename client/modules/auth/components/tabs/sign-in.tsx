import React from "react"
import MagicLinkSignInForm from "@/modules/auth/components/forms/sign-in/magic-link"
import PasswordSignInForm from "@/modules/auth/components/forms/sign-in/password"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const SignInTab = () => {
  return (
    <Tabs defaultValue="password" className="mt-8 h-72 w-full md:w-[400px]">
      <TabsList className="w-full">
        <TabsTrigger value="password" className="w-full">
          密碼
        </TabsTrigger>
        <TabsTrigger value="magicLink" className="w-full">
          Magic Link
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
