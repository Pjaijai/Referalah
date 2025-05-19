"use client"

import React, { FunctionComponent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getFiresByUserUuid } from "@/utils/common/api"
import { supabase } from "@/utils/services/supabase/config"

import { EFireType } from "@/types/common/enums/fire-type"
import { EUserStatus } from "@/types/common/user-status"
import useGetFiresByUserUuid from "@/hooks/api/fire/get-fires-by-user-uuid"
import useUserStore, { TFiresRecord } from "@/hooks/state/user/store"
import { useToast } from "@/components/ui/use-toast"

interface IAuthProviderProps {
  children: React.ReactNode
}
const AuthProvider: FunctionComponent<IAuthProviderProps> = ({ children }) => {
  const setUserState = useUserStore((state) => state.setUser)
  const reSetUserState = useUserStore((state) => state.reSetUser)
  const setFires = useUserStore((state) => state.setFires)
  const [userUuid, setUserUuid] = useState<string | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const { data: fires } = useGetFiresByUserUuid(userUuid)

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
    if (fires) {
      const firesRecords: TFiresRecord[] = fires.map((f) => ({
        type: EFireType.JOB_JOURNEY,
        uuid: f.ref_uuid,
      }))

      setFires(firesRecords)
    }
  }, [fires])

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
