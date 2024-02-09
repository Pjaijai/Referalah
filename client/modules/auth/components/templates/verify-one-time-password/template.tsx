"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useI18n } from "@/utils/services/internationalization/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { siteConfig } from "@/config/site"
import useVerifyOneTimePassword from "@/hooks/auth/verify-email-one-time-password"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import FormTextInput from "@/components/customized-ui/form/input"
import TextInput from "@/components/customized-ui/inputs/text"

const VerifyEmailOneTimePasswordPageTemplate = () => {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useI18n()
  const email = searchParams.get("email")
  const { mutate: verify } = useVerifyOneTimePassword()

  const verifyOneTimePasswordSchema = z.object({
    token: z
      .string()
      .min(1, { message: t("validation.text.minimum_length", { count: 1 }) }),
  })

  const form = useForm<z.infer<typeof verifyOneTimePasswordSchema>>({
    resolver: zodResolver(verifyOneTimePasswordSchema),
    defaultValues: {
      token: "",
    },
  })

  const onSubmit = (values: z.infer<typeof verifyOneTimePasswordSchema>) => {
    if (!email) return
    verify(
      { email, token: values.token.trim() },
      {
        onSuccess: (res) => {
          router.push(siteConfig.page.main.href)
          toast({
            title: t("auth.verify_one_time_password.success"),
          })
        },
        onError: (error: any) => {
          if (error.message.includes("Token has expired or is invalid")) {
            return toast({
              title: t(
                "auth.verify_one_time_password.token_expired_or_invalid"
              ),
              variant: "destructive",
            })
          }

          if (error.message.includes("User not found")) {
            return toast({
              title: t("auth.verify_one_time_password.user_not_found"),
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

  if (!email) throw Error

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-8 flex flex-row  justify-center  gap-8 "
      >
        <div className="flex w-full max-w-sm flex-col gap-4">
          <TextInput
            value={email}
            disabled={true}
            label={t("auth.form.email_label")}
          />
          <FormTextInput
            control={form.control}
            label={t(
              "auth.verify_one_time_password.your_one_time_password_label"
            )}
            name="token"
          />

          <Button className="mt-4" type="submit">
            {t("general.verify")}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default VerifyEmailOneTimePasswordPageTemplate
