"use client"

import React, { FunctionComponent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/utils/services/supabase/config"

import { EUserStatus } from "@/types/common/user-status"
import useUserStore from "@/hooks/state/user/store"
import { useToast } from "@/components/ui/use-toast"

interface IAuthProviderProps {
  children: React.ReactNode
}
const AuthProvider: FunctionComponent<IAuthProviderProps> = ({ children }) => {
  const setUserState = useUserStore((state) => state.setUser)
  const reSetUserState = useUserStore((state) => state.reSetUser)
  const [userUuid, setUserUuid] = useState<string | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && accessToken && session.access_token !== accessToken) {
        router.refresh()
      } else if (
        session &&
        accessToken &&
        session.access_token === accessToken
      ) {
        setUserUuid(session.user.id)
        setAccessToken(session.access_token)
      } else if (session && !accessToken) {
        setUserUuid(session.user.id)
        setAccessToken(session.access_token)
      } else {
        setUserUuid(null)
        reSetUserState()
        setAccessToken(null)
      }
    })

    return () => {
      authListener?.unsubscribe()
    }
  }, [accessToken, supabase, router])

  useEffect(() => {
    const fetchData = async () => {
      if (!userUuid) {
        reSetUserState()
        return
      }

      try {
        const { data, error } = await supabase
          .from("user")
          .select("uuid, username, avatar_url, status")
          .eq("uuid", userUuid)
          .single()

        if (error) {
          throw error
        }

        setUserState({
          uuid: data.uuid,
          username: data.username,
          photoUrl: data.avatar_url,
          status: data.status as EUserStatus | null,
        })
      } catch (error) {
        toast({
          title: "登入出事！",
          description: "好似有啲錯誤，如果試多幾次都係咁，請聯絡我🙏🏻",
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [userUuid, reSetUserState, setUserState, toast, supabase])

  return <>{children}</>
}

export default AuthProvider
