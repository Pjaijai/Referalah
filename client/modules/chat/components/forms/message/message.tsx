"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { sendMessageInFormSchema } from "@/modules/chat/validations/send-messsage"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import FormTextInput from "@/components/customized-ui/form/input"
import { Icons } from "@/components/icons"

const SendMessageForm = () => {
  const form = useForm<z.infer<typeof sendMessageInFormSchema>>({
    resolver: zodResolver(sendMessageInFormSchema),
    defaultValues: {
      message: "",
    },
  })

  const onSubmit = (values: z.infer<typeof sendMessageInFormSchema>) => {}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="relative">
          <FormTextInput control={form.control} name="email" />

          <Button
            type="submit"
            variant={"ghost"}
            size={"xs"}
            className="absolute right-0 top-1/2  -translate-y-1/2 hover:bg-transparent"
          >
            <Icons.send />
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default SendMessageForm
