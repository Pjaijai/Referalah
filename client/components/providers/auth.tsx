"use client"

import React, { FunctionComponent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/utils/services/supabase/config"

import useUserStore from "@/hooks/state/user/store"
import { useToast } from "@/components/ui/use-toast"

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
  const { toast } = useToast()

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
            .select("uuid, username, avatar_url")
            .eq("uuid", userUuid)
            .single()

          if (!error) {
            setUserState({
              uuid: data.uuid,
              username: data.username,
              photoUrl: data.avatar_url,
            })
          } else {
            toast({
              title: "登入出事！",
              description: "好似有啲錯誤，如果試多幾次都係咁，請聯絡我🙏🏻",
              variant: "destructive",
            })
            throw error
          }
        } catch (error) {
          toast({
            title: "登入出事！",
            description: "好似有啲錯誤，如果試多幾次都係咁，請聯絡我🙏🏻",
            variant: "destructive",
          })
          throw error
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
