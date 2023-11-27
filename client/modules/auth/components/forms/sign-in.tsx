"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { signInFormSchema } from "@/modules/auth/validations/sign-in"
import { zodResolver } from "@hookform/resolvers/zod"
import { AuthError } from "@supabase/supabase-js"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { siteConfig } from "@/config/site"
import useSignInWithEmailPassword from "@/hooks/auth/sign-in-with-email-password"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import FormTextInput from "@/components/customized-ui/form/input"
import FormPasswordInput from "@/components/customized-ui/form/password"

interface ISignInFormProps {}

const SignInForm: React.FunctionComponent<ISignInFormProps> = ({}) => {
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { mutate: signIn } = useSignInWithEmailPassword()

  const onSubmit = (values: z.infer<typeof signInFormSchema>) => {
    signIn(
      { email: values.email, password: values.password },
      {
        onSuccess: (res) => {
          toast({
            title: "登入成功！",
          })
          router.push(siteConfig.page.main.href)
        },
        onError: (error: any) => {
          if (error.message.includes("Invalid login credentials")) {
            return toast({
              title: "Invalid login credentials",
              description: "change another one",
              variant: "destructive",
            })
          }

          return toast({
            title: "出事！",
            description: "好似有啲錯誤，如果試多幾次都係咁，請聯絡我🙏🏻",
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
        className="flex flex-col gap-4"
      >
        <FormTextInput
          control={form.control}
          label="電郵 | Email"
          name="email"
        />

        <FormPasswordInput
          control={form.control}
          label="password"
          name="password"
        />

        <Button type="submit"> 登入 | Sign in </Button>
      </form>
    </Form>
  )
}

export default SignInForm
