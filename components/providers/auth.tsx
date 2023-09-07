"use client"

import React, { FunctionComponent, useEffect } from "react"
import { supabase } from "@/utils/services/supabase/config"

import useUserStore from "@/hooks/state/user/useUserStore"

interface IAuthProviderProps {
  children: React.ReactNode
}
const AuthProvider: FunctionComponent<IAuthProviderProps> = ({ children }) => {
  const setUserState = useUserStore((state) => state.setUser)
  const reSetUserState = useUserStore((state) => state.reSetUser)
  const user = useUserStore((state) => state)

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && user.isSignIn !== true) {
        const { data, error }: any = await supabase
          .from("user")
          .select("*")
          .eq("uuid", session.user.id)
          .single()

        setUserState({
          email: data.email,
          uuid: data.uuid,
          username: data.username,
        })
      } else {
        reSetUserState()
      }

      console.log("session", !!session)
    })
  }, [])

  return <>{children}</>
}

export default AuthProvider
