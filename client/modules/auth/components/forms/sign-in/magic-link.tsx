"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { EEmaiVerification } from "@/modules/auth/types/email-verification"
import { useI18n } from "@/utils/services/internationalization/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { siteConfig } from "@/config/site"
import useSignInWithMagicLink from "@/hooks/auth/sign-in-with-magic-link"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import FormTextInput from "@/components/customized-ui/form/input"

interface IMagicLinkSignInFormProps {}

const MagicLinkSignInForm: React.FunctionComponent<
  IMagicLinkSignInFormProps
> = ({}) => {
  const { toast } = useToast()
  const router = useRouter()
  const t = useI18n()

  const magicLinkSignInFormSchema = z.object({
    email: z.string().email(t("validation.email.email_format_not_right")),
  })

  const form = useForm<z.infer<typeof magicLinkSignInFormSchema>>({
    resolver: zodResolver(magicLinkSignInFormSchema),
    defaultValues: {
      email: "",
    },
  })

  const { mutate: signIn } = useSignInWithMagicLink()

  const onSubmit = (values: z.infer<typeof magicLinkSignInFormSchema>) => {
    signIn(
      { email: values.email },
      {
        onSuccess: (res) => {
          const queryString = new URLSearchParams({
            type: EEmaiVerification.MAGIC_LINK,
            email: values.email,
          }).toString()

          router.push(
            `${siteConfig.page.emailVerification.href}` + "?" + queryString
          )
        },
        onError: (error: any) => {
          if (error.message.includes("Invalid login credentials")) {
            return toast({
              title: t("auth.sign_in.magic_link.email_invalid_error"),
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

export default MagicLinkSignInForm
