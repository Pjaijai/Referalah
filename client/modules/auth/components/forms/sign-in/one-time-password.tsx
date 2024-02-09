"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/utils/services/internationalization/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { siteConfig } from "@/config/site"
import useSignInWithOneTimePassword from "@/hooks/auth/sign-in-with-one-time-password"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import FormTextInput from "@/components/customized-ui/form/input"

interface IMagicLinkSignInFormProps {}

const OneTimePasswordSignInForm: React.FunctionComponent<
  IMagicLinkSignInFormProps
> = ({}) => {
  const { toast } = useToast()
  const router = useRouter()
  const t = useI18n()

  const oneTimePasswordSignInFormSchema = z.object({
    email: z.string().email(t("validation.email.email_format_not_right")),
  })

  const form = useForm<z.infer<typeof oneTimePasswordSignInFormSchema>>({
    resolver: zodResolver(oneTimePasswordSignInFormSchema),
    defaultValues: {
      email: "",
    },
  })

  const { mutate: signIn } = useSignInWithOneTimePassword()

  const onSubmit = (
    values: z.infer<typeof oneTimePasswordSignInFormSchema>
  ) => {
    signIn(
      { email: values.email },
      {
        onSuccess: (res) => {
          const queryString = new URLSearchParams({
            email: values.email,
          }).toString()

          router.push(
            `${siteConfig.page.verifyOneTimePassword.href}` + "?" + queryString
          )
        },
        onError: (error: any) => {
          if (error.message.includes("Invalid login credentials")) {
            return toast({
              title: t("auth.sign_in.one_time_password.email_invalid_error"),
              variant: "destructive",
            })
          }

          return toast({
            title: t("general.error.title"),
            description: t("general.error.description"),
            variant: "destructive",
          })
        },
      }
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-8 flex flex-col  justify-between gap-8"
      >
        <div className="flex flex-col">
          <FormTextInput
            control={form.control}
            label={t("auth.form.email_label")}
            name="email"
          />
        </div>

        <Button type="submit">{t("general.sign_in")}</Button>
      </form>
    </Form>
  )
}

export default OneTimePasswordSignInForm
