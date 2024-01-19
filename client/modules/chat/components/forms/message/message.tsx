"use client"

import React from "react"
import { useI18n } from "@/utils/services/internationalization/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { EQueryKeyString } from "@/types/common/query-key-string"
import useCreateMessage from "@/hooks/api/message/creat-message"
import useUpdateConversation from "@/hooks/api/message/update-conversation"
import useUserStore from "@/hooks/state/user/store"
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
  const t = useI18n()
  const queryClient = useQueryClient()
  const userUuid = useUserStore((state) => state.uuid)
  const { toast } = useToast()
  const { mutate: create, isLoading } = useCreateMessage()
  const { mutate: update } = useUpdateConversation()
  const sendMessageInFormSchema = z.object({
    message: z
      .string()
      .min(1, { message: t("validation.send_message.required") })
      .max(10000, {
        message: t("validation.text.maximum_length", { count: 4000 }),
      }),
  })

  const form = useForm<z.infer<typeof sendMessageInFormSchema>>({
    resolver: zodResolver(sendMessageInFormSchema),
    defaultValues: {
      message: "",
    },
  })

  const { watch } = form
  const messageWatch = watch("message")
  const currentInputMessage = messageWatch.trim()

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

          if (type === "sender") {
            update(
              {
                conversationUuid,
                isReceiverSeen: false,
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({
                    queryKey: [EQueryKeyString.CONVERSATION_LIST, { userUuid }],
                  })
                },
              }
            )
          }
          if (type === "receiver") {
            update(
              {
                conversationUuid,
                isSenderSeen: false,
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({
                    queryKey: [EQueryKeyString.CONVERSATION_LIST, { userUuid }],
                  })
                },
              }
            )
          }
        },
        onError: () => {
          toast({
            title: t("chat.form.error.send_message_failed"),
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
        className="relative mt-8 p-2"
      >
        {type === "sender" && !isReceiverAccepted && (
          <div className="sticky bottom-0 rounded-lg border-2 p-2  text-center">
            {t("chat.user_has_not_accept_the_request")}
          </div>
        )}

        {type === "receiver" && !isReceiverAccepted && (
          <div className="sticky bottom-0 rounded-lg border-2 p-4 text-center">
            {t("chat.need_to_accept_the_request")}
          </div>
        )}

        {isReceiverAccepted && (
          <div className="fixed bottom-0 w-full p-4 md:w-[65%] ">
            <FormTextInput
              control={form.control}
              name="message"
              placeholder={t("chat.form.message_placeholder")}
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
