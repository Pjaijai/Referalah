"use client"

import React from "react"
import Link from "next/link"
import { authFormSchema } from "@/modules/auth/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { siteConfig } from "@/config/site"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import FormTextInput from "@/components/customized-ui/form/input"

interface IAuthFormProps {
  onSubmit: any
}

const AuthForm: React.FunctionComponent<IAuthFormProps> = ({ onSubmit }) => {
  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: "",
    },
  })
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

        <Alert>
          <AlertTitle>你會收到條登入Link，唔洗密碼👍🏻</AlertTitle>
          <AlertDescription>
            你個電郵Email只會係你主動聯絡人個時先話俾對方知。
          </AlertDescription>
        </Alert>
        <p className="text-muted-foreground">
          點擊「登入/註冊」按鈕即表示你同意
          <Link
            href={siteConfig.page.privacyPolicy.href}
            className="border-green-700 dark:border-yellow-300 text-green-700
] dark:text-yellow-300 "
          >
            私隱政策
          </Link>
          。<br />
          By clicking the "Sign in/Sign up" button, you agree to the
          <Link href={siteConfig.page.privacyPolicy.href}>privacy policy</Link>.
        </p>
        <Button type="submit"> 登入/註冊 </Button>
      </form>
    </Form>
  )
}

export default AuthForm
