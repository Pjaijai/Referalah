"use client"

import React, { useState } from "react"
import { sendMessageInFormSchema } from "@/modules/chat/validations/send-messsage"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import useCreateMessage from "@/hooks/api/message/creat-message"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import FormTextInput from "@/components/customized-ui/form/input"
import { Icons } from "@/components/icons"

interface ISendMessageFormProps {
  conversationUuid: string | null
  type: "sender" | "receiver"
  isReceiverAccepted: boolean
}

const SendMessageForm: React.FunctionComponent<ISendMessageFormProps> = ({
  conversationUuid,
  type,
  isReceiverAccepted,
}) => {
  const form = useForm<z.infer<typeof sendMessageInFormSchema>>({
    resolver: zodResolver(sendMessageInFormSchema),
    defaultValues: {
      message: "",
    },
  })
  const { watch } = form
  const { toast } = useToast()
  const messageWatch = watch("message")
  const currentInputMessage = messageWatch.trim()
  const { mutate: create, isLoading } = useCreateMessage()
  const onSubmit = async (values: z.infer<typeof sendMessageInFormSchema>) => {
    if (!conversationUuid) return

    create(
      {
        conversationUuid,
        msgBody: values.message.trim(),
      },
      {
        onSuccess: () => {
          form.reset()
        },
        onError: () => {
          toast({
            title: "Send唔到個message :(",
            variant: "destructive",
          })
        },
      }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {type === "sender" && !isReceiverAccepted && (
          <div className="sticky bottom-0 rounded-lg border-2 p-2  text-center">
            對方未接受請求
          </div>
        )}

        {type === "receiver" && !isReceiverAccepted && (
          <div className="rounded-2 sticky bottom-0 border-2 p-4 text-center">
            請先接受對話請求
          </div>
        )}

        {isReceiverAccepted && (
          <div className="relative p-3">
            <FormTextInput
              control={form.control}
              name="message"
              placeholder="係到寫啲野俾對方:)"
            />

            <Button
              type="submit"
              variant={"ghost"}
              size={"xs"}
              className="absolute right-2 top-1/2  -translate-y-1/2 hover:bg-transparent"
              disabled={isLoading}
            >
              {currentInputMessage && !isLoading && (
                <Icons.send className="opacity-100 transition-all duration-1000" />
              )}
              {isLoading && <Icons.loader />}
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}

export default SendMessageForm
