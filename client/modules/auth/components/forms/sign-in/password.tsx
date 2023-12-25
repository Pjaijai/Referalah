"use client"

import React, { useCallback, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { passwordSignInFormSchema } from "@/modules/auth/validations/password-sign-in"
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
  return (
    <Link
      href={siteConfig.page.forgetPassword.href}
      className={buttonVariants({
        variant: "link",
        size: "sm",
        className: "h-fit px-0 py-0 text-sm underline",
      })}
    >
      忘記密碼？
    </Link>
  )
}

const PasswordSignInForm: React.FunctionComponent<
  IPasswordSignInFormProps
> = ({}) => {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof passwordSignInFormSchema>>({
    resolver: zodResolver(passwordSignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { mutate: signIn } = useSignInWithEmailPassword()

  const onSubmit = useCallback(
    (values: z.infer<typeof passwordSignInFormSchema>) => {
      setIsLoading(true)
      signIn(
        { email: values.email, password: values.password },
        {
          onSuccess: () => {
            toast({
              title: "登入成功！",
            })
            router.push(siteConfig.page.main.href)
          },
          onError: (error: any) => {
            if (error.message.includes("Invalid login credentials")) {
              return toast({
                title: "電郵或密碼錯誤",
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
    [router, signIn, toast]
  )

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-8 flex flex-col justify-between gap-8"
      >
        <FormTextInput control={form.control} label="電郵" name="email" />

        <FormPasswordInput
          control={form.control}
          label="密碼"
          name="password"
          leftLabel={<ForgetPassWordLink />}
        />

        <Button type="submit" className="shrink-0">
          {isLoading ? "等等" : "登入"}
        </Button>
      </form>
    </Form>
  )
}

export default PasswordSignInForm
