"use client"

import React, { useCallback, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useI18n } from "@/utils/services/internationalization/client"
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
  const t = useI18n()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const [isLoading, setIsLoading] = useState(false)

  const resetPasswordFormSchema = z
    .object({
      password: z
        .string()
        .min(8, { message: t("validation.text.minimum_length", { count: 8 }) })
        .max(20, {
          message: t("validation.text.maximum_length", { count: 20 }),
        }),
      confirmPassword: z
        .string()
        .min(8, { message: t("validation.text.minimum_length", { count: 8 }) })
        .max(20, {
          message: t("validation.text.maximum_length", { count: 20 }),
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.confirm_password.not_match_with_password"),
      path: ["confirmPassword"],
    })

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
              title: t("auth.reset_password.success"),
            })

            router.push(`${siteConfig.page.main.href}`)
          },
          onError: (error: any) => {
            if (error.message === "Auth session missing!") {
              return toast({
                title: t("auth.reset_password.error.invalid_url_title"),
                description: t(
                  "auth.reset_password.error.invalid_url_description"
                ),
                variant: "destructive",
              })
            }

            if (
              error.message ===
              "New password should be different from the old password."
            ) {
              return toast({
                title: t(
                  "auth.sign_up.error.new_password_same_as_old_pass_word_title"
                ),
                description: t(
                  "auth.sign_up.error.new_password_same_as_old_pass_word_description"
                ),
                variant: "destructive",
              })
            }
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
            <TextInput
              value={email || ""}
              label={t("auth.form.email_label")}
              disabled
            />
            <FormPasswordInput
              control={form.control}
              label={t("form.auth.new_password_label")}
              name="password"
              description={t("form.general.password_description")}
            />
            <FormPasswordInput
              control={form.control}
              label={t("auth.form.confirm_password_label")}
              name="confirmPassword"
            />

            <Button type="submit" className="shrink-0" disabled={isLoading}>
              {isLoading ? t("general.wait") : t("form.general.submit")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default ResetPasswordPageTemplate
