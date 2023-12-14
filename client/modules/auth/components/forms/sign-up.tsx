"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { EEmaiVerification } from "@/modules/auth/types/email-verification"
import { signUpFormSchema } from "@/modules/auth/validations/sign-up"
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
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

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
            title: "註冊成功！",
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
              title: "此電郵已被其他人使用",
              variant: "destructive",
            })
          }
          if (
            error.message.includes(
              'duplicate key value violates unique constraint "user_username_key"'
            )
          ) {
            return toast({
              title: "此用戶名稱已被其他人使用",
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
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-8"
      >
        <FormTextInput control={form.control} label="電郵" name="email" />
        <FormTextInput
          control={form.control}
          label="用戶名稱"
          name="username"
          description="註冊後可以更改"
        />
        <FormPasswordInput
          control={form.control}
          label="密碼"
          name="password"
          description="密碼必須為8至20字元之間"
        />
        <FormPasswordInput
          control={form.control}
          label="入多次密碼"
          name="confirmPassword"
        />
        <p className="text-xs text-muted-foreground">
          點擊「註冊 | Register」按鈕即表示你同意
          <HighlightedLink href={siteConfig.page.privacyPolicy.href}>
            私隱政策
          </HighlightedLink>
          及
          <HighlightedLink href={siteConfig.page.termsAndConditions.href}>
            服務條款
          </HighlightedLink>
          。<br />
          By clicking the &quot;註冊 | Register&quot; button, you agree to the{" "}
          <HighlightedLink href={siteConfig.page.privacyPolicy.href}>
            Privacy Policy
          </HighlightedLink>
          {""} and {""}
          <HighlightedLink href={siteConfig.page.termsAndConditions.href}>
            Terms and Conditions
          </HighlightedLink>
          .
        </p>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "等等" : "註冊 | Register"}
        </Button>
      </form>
      <p className="mt-4 w-full text-center  font-normal ">
        已有帳號？係
        <Link
          href={siteConfig.page.signIn.href}
          className="border-b border-foreground"
        >
          呢度登入
        </Link>
      </p>
    </Form>
  )
}

export default SignUpForm
