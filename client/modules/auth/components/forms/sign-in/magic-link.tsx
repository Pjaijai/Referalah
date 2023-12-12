"use client"

import React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { EEmaiVerification } from "@/modules/auth/types/email-verification"
import { magicLinkSignInFormSchema } from "@/modules/auth/validations/magic-link-sign-in"
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
  const pathname = usePathname()
  const searchParams = useSearchParams()
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
              title: "電郵錯誤",
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
        className="mt-8 flex flex-col  justify-between gap-8"
      >
        <div className="flex flex-col">
          <FormTextInput control={form.control} label="電郵" name="email" />
          <p className="text-sm text-muted-foreground ">
            你會收到條登入連結，唔洗密碼👍🏻
          </p>
        </div>

        <Button type="submit">登入</Button>
      </form>
    </Form>
  )
}

export default MagicLinkSignInForm
