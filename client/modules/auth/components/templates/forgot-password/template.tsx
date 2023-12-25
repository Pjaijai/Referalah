"use client"

import React, { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { EEmaiVerification } from "@/modules/auth/types/email-verification"
import { forgotPasswordFormSchema } from "@/modules/auth/validations/forgot-password"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { siteConfig } from "@/config/site"
import useResetPassword from "@/hooks/auth/reset-password"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import FormTextInput from "@/components/customized-ui/form/input"

const ForgotPasswordPageTemplate = () => {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  })

  const { mutate: reset } = useResetPassword()

  const onSubmit = useCallback(
    (values: z.infer<typeof forgotPasswordFormSchema>) => {
      setIsLoading(true)
      reset(
        { email: values.email },
        {
          onSuccess: () => {
            const queryString = new URLSearchParams({
              type: EEmaiVerification.RESET_PASSWORD,
              email: values.email,
            }).toString()

            router.push(
              `${siteConfig.page.emailVerification.href}` + "?" + queryString
            )
          },
          onError: (error: any) => {
            return toast({
              title: "出事！",
              description: "好似有啲錯誤，如果試多幾次都係咁，請聯絡我🙏🏻",
              variant: "destructive",
            })
          },
          onSettled: () => {
            setIsLoading(false)
          },
        }
      )
    },
    [reset, router, toast]
  )

  return (
    <div className="flex h-full w-full justify-center ">
      <div className="mt-8 w-full max-w-md">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 flex flex-col justify-between gap-8"
          >
            <FormTextInput control={form.control} label="電郵" name="email" />

            <Button type="submit" className="shrink-0" disabled={isLoading}>
              {isLoading ? "等等" : "繼續"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default ForgotPasswordPageTemplate
