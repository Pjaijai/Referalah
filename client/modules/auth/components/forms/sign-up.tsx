"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { EEmaiVerification } from "@/modules/auth/types/email-verification"
import { useI18n } from "@/utils/services/internationalization/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { siteConfig } from "@/config/site"
import useSignUpWithEmailPassword from "@/hooks/auth/sign-up-with-email-password"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import FormTextInput from "@/components/customized-ui/form/input"
import FormPasswordInput from "@/components/customized-ui/form/password"
import HighlightedLink from "@/components/customized-ui/links/highlighted"

interface ISignUpFormProps {}

const SignUpForm: React.FunctionComponent<ISignUpFormProps> = ({}) => {
  const t = useI18n()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const passwordSchema = z
    .string()
    .min(8, { message: t("validation.text.minimum_length", { count: 8 }) })
    .max(20, { message: t("validation.text.maximum_length", { count: 20 }) })
  const signUpFormSchema = z
    .object({
      email: z.string().email(t("validation.email.email_format_not_right")),
      username: z
        .string()
        .min(1, { message: t("validation.text.minimum_length", { count: 1 }) })
        .max(20, {
          message: t("validation.text.maximum_length", { count: 20 }),
        })
        .refine((value) => !/\s/.test(value), {
          message: t("validation.text.no_white_space"),
        }),
      password: passwordSchema,
      confirmPassword: passwordSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.confirm_password.not_match_with_password"),
      path: ["confirmPassword"],
    })

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const { watch } = form
  const passwordWatch = watch("password")
  const confirmPasswordWatch = watch("confirmPassword")

  const { mutate: createUser } = useSignUpWithEmailPassword()
  const onSubmit = (values: z.infer<typeof signUpFormSchema>) => {
    setIsLoading(true)
    createUser(
      {
        email: values.email,
        password: values.password,
        username: values.username,
      },
      {
        onSuccess: (res) => {
          toast({
            title: t("auth.sign_up.submit.success_message"),
          })
          const queryString = new URLSearchParams({
            type: EEmaiVerification.EMAIL_PASSWORD_SIGN_UP,
            email: values.email,
          }).toString()

          router.push(
            `${siteConfig.page.emailVerification.href}` + "?" + queryString
          )
        },
        onError: (error: any) => {
          if (error.message.includes("User already registered")) {
            return toast({
              title: t("auth.sign_up.email_duplication_error_message"),
              variant: "destructive",
            })
          }
          if (
            error.message.includes(
              'duplicate key value violates unique constraint "user_username_key"'
            )
          ) {
            return toast({
              title: t("auth.sign_up.username_duplication_error_message"),
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
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-8"
      >
        <FormTextInput
          control={form.control}
          label={t("auth.form.email_label")}
          name="email"
        />
        <FormTextInput
          control={form.control}
          label={t("auth.form.username_label")}
          name="username"
          description={t("auth.form.username_description")}
        />
        <FormPasswordInput
          control={form.control}
          label={t("auth.form.password_label")}
          name="password"
          description={t("form.general.password_description")}
          value={passwordWatch}
        />
        <FormPasswordInput
          control={form.control}
          label={t("auth.form.confirm_password_label")}
          name="confirmPassword"
          value={confirmPasswordWatch}
        />
        <p className="text-xs text-muted-foreground">
          {t("auth.sign_up.click_to_agree_text")}
          <HighlightedLink href={siteConfig.page.privacyPolicy.href}>
            {t("auth.sign_up.privacy_policy")}
          </HighlightedLink>
          {t("auth.sign_up.and")}
          <HighlightedLink href={siteConfig.page.termsAndConditions.href}>
            {t("auth.sign_up.terms_and_conditions")}
          </HighlightedLink>
        </p>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? t("general.wait")
            : t("auth.sign_up.confirm_button_title")}
        </Button>
      </form>
      <p className="mt-4 flex w-full flex-col items-center justify-center gap-1 text-center font-normal  md:flex-row ">
        {t("auth.sign_up.redirect_to_sign_up")}
        <Link
          href={siteConfig.page.signIn.href}
          className="border-b border-foreground"
        >
          {t("auth.form.sign_up.redirect_to_sign_up.redirect_to_sign_up")}
        </Link>
      </p>
    </Form>
  )
}

export default SignUpForm
