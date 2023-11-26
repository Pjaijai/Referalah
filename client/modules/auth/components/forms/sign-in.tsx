"use client"

import React from "react"
import { signInFormSchema } from "@/modules/auth/validations/sign-in"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import useSignInWithEmailPassword from "@/hooks/auth/sign-in-with-email-password"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import FormTextInput from "@/components/customized-ui/form/input"
import FormPasswordInput from "@/components/customized-ui/form/password"

interface ISignInFormProps {}

const SignInForm: React.FunctionComponent<ISignInFormProps> = ({}) => {
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { mutate: signIn } = useSignInWithEmailPassword()

  const onSubmit = (values: z.infer<typeof signInFormSchema>) => {
    signIn({ email: values.email, password: values.password })
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
