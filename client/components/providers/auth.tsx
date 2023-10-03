"use client"

import React, { FunctionComponent, useEffect, useState } from "react"
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
  const [userUuid, setUserUuid] = useState<string | null>(null)
  const user = useUserStore((state) => state)
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && session.access_token !== accessToken) {
        router.refresh()
      } else if (
        session &&
        session.access_token === accessToken &&
        !user.isSignIn
      ) {
        setUserUuid(session.user.id)
      } else {
        setUserUuid(null)
        reSetUserState()
      }
    })

    return () => {
      authListener?.unsubscribe()
    }
  }, [accessToken, supabase, router])

  useEffect(() => {
    const fetchData = async () => {
      if (userUuid) {
        try {
          const { data, error }: any = await supabase
            .from("user")
            .select("email, uuid, username, avatar_url")
            .eq("uuid", userUuid)
            .single()

          if (!error) {
            setUserState({
              email: data.email,
              uuid: data.uuid,
              username: data.username,
              photoUrl: data.avatar_url,
            })
          } else {
            console.error("Error fetching user data:", error)
          }
        } catch (error) {
          console.error("Error during async operation:", error)
        }
      } else {
        reSetUserState()
      }
    }

    fetchData()
  }, [userUuid])

  return <>{children}</>
}

export default AuthProvider
