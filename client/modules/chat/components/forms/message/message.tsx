"use client"

import React, { useState } from "react"
import { sendMessageInFormSchema } from "@/modules/chat/validations/send-messsage"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import useCreateMessage from "@/hooks/api/message/creat-message"
import useUpdateConversationLastUpdatedAt from "@/hooks/api/message/update-conversation-last-updated-at"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import FormTextInput from "@/components/customized-ui/form/input"
import { Icons } from "@/components/icons"

interface ISendMessageFormProps {
  conversationUuid: string | null
}

const SendMessageForm: React.FunctionComponent<ISendMessageFormProps> = ({
  conversationUuid,
}) => {
  const form = useForm<z.infer<typeof sendMessageInFormSchema>>({
    resolver: zodResolver(sendMessageInFormSchema),
    defaultValues: {
      message: "",
    },
  })
  const { watch } = form
  const messageWatch = watch("message")
  const { mutate: create } = useCreateMessage()
  const { mutate: update } = useUpdateConversationLastUpdatedAt()
  const [messageCreatedAt, setMessageCreatedAt] = useState()
  const onSubmit = async (values: z.infer<typeof sendMessageInFormSchema>) => {
    if (!conversationUuid) return

    create(
      {
        conversationUuid,
        msgBody: values.message,
      },
      {
        onSuccess() {
          form.reset()
        },
      }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="relative">
          <FormTextInput control={form.control} name="message" />

          <Button
            type="submit"
            variant={"ghost"}
            size={"xs"}
            className="absolute right-0 top-1/2  -translate-y-1/2 hover:bg-transparent"
          >
            {messageWatch && (
              <Icons.send className="opacity-100 transition-all duration-1000" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default SendMessageForm
