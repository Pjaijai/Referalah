"use client"

import React, { FunctionComponent, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/utils/services/supabase/config"

import useUserStore from "@/hooks/state/user/store"

interface IAuthProviderProps {
  accessToken: string | null
  children: React.ReactNode
}
const AuthProvider: FunctionComponent<IAuthProviderProps> = ({
  accessToken,
  children,
}) => {
  const setUserState = useUserStore((state) => state.setUser)
  const reSetUserState = useUserStore((state) => state.reSetUser)
  const user = useUserStore((state) => state)
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && session.access_token !== accessToken) {
        router.refresh()
      } else if (
        session &&
        session.access_token === accessToken &&
        user.isSignIn !== true
      ) {
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

    return () => {
      authListener?.unsubscribe()
    }
  }, [accessToken, supabase, router])

  return <>{children}</>
}

export default AuthProvider
