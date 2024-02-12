"use client"

import React, { useCallback, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useI18n } from "@/utils/services/internationalization/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { siteConfig } from "@/config/site"
import useSignInWithEmailPassword from "@/hooks/auth/sign-in-with-email-password"
import { Button, buttonVariants } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import FormTextInput from "@/components/customized-ui/form/input"
import FormPasswordInput from "@/components/customized-ui/form/password"

interface IPasswordSignInFormProps {}

const ForgetPassWordLink = () => {
  const t = useI18n()

  return (
    <Link
      href={siteConfig.page.forgetPassword.href}
      className={buttonVariants({
        variant: "link",
        size: "sm",
        className: "h-fit px-0 py-0 text-sm underline",
      })}
    >
      {t("general.forgot_password")}
    </Link>
  )
}

const PasswordSignInForm: React.FunctionComponent<
  IPasswordSignInFormProps
> = ({}) => {
  const t = useI18n()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const passwordSignInFormSchema = z.object({
    email: z.string().email(t("validation.email.email_format_not_right")),
    password: z
      .string()
      .min(8, { message: t("validation.text.minimum_length", { count: 8 }) })
      .max(20, { message: t("validation.text.maximum_length", { count: 20 }) }),
  })

  const form = useForm<z.infer<typeof passwordSignInFormSchema>>({
    resolver: zodResolver(passwordSignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const { watch } = form
  const passwordWatch = watch("password")

  const { mutate: signIn } = useSignInWithEmailPassword()

  const onSubmit = useCallback(
    (values: z.infer<typeof passwordSignInFormSchema>) => {
      setIsLoading(true)
      signIn(
        { email: values.email, password: values.password },
        {
          onSuccess: () => {
            toast({
              title: t("auth.sign_in.magic_link.submit.success"),
            })
            router.push(siteConfig.page.main.href)
          },
          onError: (error: any) => {
            if (error.message.includes("Invalid login credentials")) {
              return toast({
                title: t(
                  "auth.sign_in.email_password.credential_invalid_error"
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
    [router, signIn, toast]
  )

  return (
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

        <FormPasswordInput
          control={form.control}
          label={t("auth.form.password_label")}
          name="password"
          leftLabel={<ForgetPassWordLink />}
          value={passwordWatch}
        />

        <Button type="submit" className="shrink-0">
          {isLoading ? t("general.wait") : t("general.sign_in")}
        </Button>
      </form>
    </Form>
  )
}

export default PasswordSignInForm
