"use client"

import React, { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { EEmaiVerification } from "@/modules/auth/types/email-verification"
import { useI18n } from "@/utils/services/internationalization/client"
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
  const t = useI18n()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const forgotPasswordFormSchema = z.object({
    email: z.string().email(t("validation.email.email_format_not_right")),
  })

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
              title: t("general.error.title"),
              description: t("general.error.description"),
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
      <div className="mt-8 w-full max-w-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 flex flex-col justify-between gap-8"
          >
            <FormTextInput
              control={form.control}
              label={t("auth.form.email_label")}
              name="email"
            />

            <Button type="submit" className="shrink-0" disabled={isLoading}>
              {isLoading ? t("general.wait") : t("general.continue")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default ForgotPasswordPageTemplate
