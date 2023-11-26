"use client"

import React from "react"
import { signUpFormSchema } from "@/modules/auth/validations/sign-up"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { siteConfig } from "@/config/site"
import useCreateUserWithEmailPassword from "@/hooks/auth/create-user-with-email-password"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import FormCheckBox from "@/components/customized-ui/form/check-box"
import FormTextInput from "@/components/customized-ui/form/input"
import FormPasswordInput from "@/components/customized-ui/form/password"
import HighlightedLink from "@/components/customized-ui/links/highlighted"

interface ISignUpFormProps {}

const SignUpForm: React.FunctionComponent<ISignUpFormProps> = ({}) => {
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      privacyPolicy: false,
    },
  })

  const { mutate: createUser } = useCreateUserWithEmailPassword()
  const onSubmit = (values: z.infer<typeof signUpFormSchema>) => {
    createUser({ email: values.email, password: values.password })
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
        <FormTextInput
          control={form.control}
          label="username"
          name="username"
        />
        <FormPasswordInput
          control={form.control}
          label="password"
          name="password"
        />
        <FormPasswordInput
          control={form.control}
          label="confirmPassword"
          name="confirmPassword"
        />
        <FormCheckBox
          control={form.control}
          label="privacyPolicy"
          name="privacyPolicy"
        />
        <Alert>
          <AlertTitle>你會收到條登入Link，唔洗密碼👍🏻</AlertTitle>
          <AlertDescription>
            你個電郵Email只會係你主動聯絡人個時先話俾對方知。
          </AlertDescription>
        </Alert>
        <p className="text-muted-foreground">
          點擊「登入/註冊」按鈕即表示你同意
          <HighlightedLink href={siteConfig.page.privacyPolicy.href}>
            私隱政策
          </HighlightedLink>
          及
          <HighlightedLink href={siteConfig.page.termsAndConditions.href}>
            服務條款
          </HighlightedLink>
          。<br />
          <HighlightedLink href={siteConfig.page.privacyPolicy.href}>
            privacy policy
          </HighlightedLink>{" "}
          <span className="m-2">and</span>{" "}
          <HighlightedLink href={siteConfig.page.termsAndConditions.href}>
            Terms and Conditions
          </HighlightedLink>
          .
        </p>
        <Button type="submit"> 登入/註冊 | Sign in/Sign up </Button>
      </form>
    </Form>
  )
}

export default SignUpForm
