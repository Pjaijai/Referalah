"use client"

import React, { useState } from "react"
import AuthForm from "@/modules/auth/form"
import { authFormSchema } from "@/modules/auth/validation"
import { supabase } from "@/utils/services/supabase/config"
import { z } from "zod"

import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

const AuthPageTemplate = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const onSubmit = async (values: z.infer<typeof authFormSchema>) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_WEB_URL}`,
      },
    })

    if (error) {
      return toast({
        title: "登入/註冊",
        description: "好似有啲錯誤，如果試多幾次都係咁，請聯絡我🙏🏻",
        variant: "destructive",
      })
    }
    setIsSubmitted(true)
  }

  return (
    <div className="w-[40rem]">
      {!isSubmitted && <AuthForm onSubmit={onSubmit} />}

      {isSubmitted && (
        <div className="flex flex-col  justify-center items-center rounded-lg p-4 gap-4">
          <Icons.bigSend />
          <span>Send 咗了！請查看！</span>
          <span>請查看垃圾郵箱🙏🏻因為個網站設立無耐，會俾人當垃圾，哭左🥲</span>
          <span>相關電郵地址 no-reply@referalah.com</span>
        </div>
      )}
    </div>
  )
}

export default AuthPageTemplate
