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
        console.log(123123, session, user)
        const { data, error }: any = await supabase
          .from("user")
          .select(
            `
            email,
            uuid,
            username,
            avatar_url
            `
          )
          .eq("uuid", session.user.id)
          .single()

        setUserState({
          email: data.email,
          uuid: data.uuid,
          username: data.username,
          photoUrl: data.avatar_url,
        })
      } else {
        reSetUserState()
      }
    })
  }, [])

  return <>{children}</>
}

export default AuthProvider
