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
          Send 咗了！請查看！
        </div>
      )}
    </div>
  )
}

export default AuthPageTemplate
