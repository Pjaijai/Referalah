"use client"

import React, { useState } from "react"
import { supabase } from "@/utils/services/supabase/config"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"

const AuthPage = () => {
  return (
    <>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={["google"]}
      />
    </>
  )
}

export default AuthPage
