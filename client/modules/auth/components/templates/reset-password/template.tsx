"use client"

import React, { useCallback, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { resetPasswordFormSchema } from "@/modules/auth/validations/reset-poassword"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { siteConfig } from "@/config/site"
import useUpdatePassword from "@/hooks/auth/update-password"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import FormPasswordInput from "@/components/customized-ui/form/password"
import TextInput from "@/components/customized-ui/inputs/text"

const ResetPasswordPageTemplate = () => {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })
  const { mutate: update } = useUpdatePassword()

  const onSubmit = useCallback(
    (values: z.infer<typeof resetPasswordFormSchema>) => {
      setIsLoading(true)
      update(
        { password: values.password },
        {
          onSuccess: () => {
            toast({
              title: "密碼更改成功成功！",
            })

            router.push(`${siteConfig.page.main.href}`)
          },
          onError: (error: any) => {
            if (error.message === "Auth session missing!") {
              return toast({
                title: "過期認證連結！",
                description: "請重新發送認證連結🙏🏻",
                variant: "destructive",
              })
            }

            if (
              error.message ===
              "New password should be different from the old password."
            ) {
              return toast({
                title: "新密碼不能重用舊密碼",
                description: "俾少少創意先？",
                variant: "destructive",
              })
            }
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
    [router, toast]
  )

  return (
    <div className="flex h-full w-full justify-center ">
      <div className="mt-8 w-full max-w-md ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 flex flex-col justify-between gap-8"
          >
            <TextInput value={email || ""} label="電郵" disabled />
            <FormPasswordInput
              control={form.control}
              label="新密碼"
              name="password"
              description="密碼必須為8至20字元之間"
            />
            <FormPasswordInput
              control={form.control}
              label="入多次密碼"
              name="confirmPassword"
            />

            <Button type="submit" className="shrink-0" disabled={isLoading}>
              {isLoading ? "等等" : "提交"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default ResetPasswordPageTemplate
