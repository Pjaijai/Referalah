"use client"

import React, { useState } from "react"
import FileUploadDrawer from "@/modules/chat/components/drawers/file-upload"
import { useI18n } from "@/utils/services/internationalization/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { EQueryKeyString } from "@/types/common/query-key-string"
import { cn } from "@/lib/utils"
import useCreateMessage from "@/hooks/api/message/create-message"
import useUpdateConversation from "@/hooks/api/message/update-conversation"
import useUploadDocument from "@/hooks/api/message/upload-document"
import useGetMediaPublicUrl from "@/hooks/api/storage/get-media-url"
import useUserStore from "@/hooks/state/user/store"
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
  const [file, setFile] = useState<File>()
  const [isFileUploadDrawerOpen, setIsFileUploadDrawerOpen] = useState(false)
  const queryClient = useQueryClient()
  const userUuid = useUserStore((state) => state.uuid)
  const { toast } = useToast()
  const { mutate: create, isLoading } = useCreateMessage()
  const { mutate: update } = useUpdateConversation()
  const { mutate: upload } = useUploadDocument()
  const { mutate: getPublicUrl } = useGetMediaPublicUrl()
  const sendMessageInFormSchema = z.object({
    message: z.string().max(10000, {
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

  const onCreateMessage = ({
    conversationUuid,
    msgBody,
    fileName,
    filePath,
    fileSize,
    internalFilePath,
  }: {
    conversationUuid: string
    msgBody?: string
    fileName?: string
    filePath?: string
    fileSize?: number
    internalFilePath?: string
  }) => {
    create(
      {
        conversationUuid,
        msgBody: msgBody,
        fileName,
        filePath,
        fileSize,
        internalFilePath,
      },
      {
        onSuccess: () => {
          form.reset()
          setFile(undefined)
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
  const onSubmit = async (values: z.infer<typeof sendMessageInFormSchema>) => {
    if (!conversationUuid) return
    if (file) {
      const filePath = `${userUuid}/${new Date().toISOString()}/${file.name}`
      upload(
        {
          file: file,
          path: filePath,
        },
        {
          onSuccess: (data) => {
            getPublicUrl(
              {
                bucketName: "conversation_documents",
                path: filePath,
              },
              {
                onSuccess: (data) => {
                  onCreateMessage({
                    conversationUuid,
                    fileName: file.name,
                    filePath: data.publicUrl,
                    fileSize: file.size,
                    internalFilePath: filePath,
                    msgBody: values.message.trim(),
                  })
                },
              }
            )
          },
          onError: (error: any) => {
            if (!error) {
              toast({
                title: t("general.error.title"),
                variant: "destructive",
              })
            }
            if (error && error.message) {
              toast({
                title: error.message,
                variant: "destructive",
              })
            }
          },
        }
      )
    } else {
      onCreateMessage({
        conversationUuid,
        msgBody: values.message.trim(),
      })
    }
  }

  const handleUpLoadFile = (files: File[]) => {
    setFile(files[0])
    setIsFileUploadDrawerOpen(false)
  }

  const handleRemoveFile = () => {
    setFile(undefined)
  }

  const handleUpLoadFile = (files: File[]) => {
    setFile(files[0])
    setIsFileUploadDrawerOpen(false)
  }

  const handleRemoveFile = () => {
    setFile(undefined)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("relative mt-8 p-2", file && "mt-20")}
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
          <div className="fixed bottom-0 mb-4 w-full  px-4 md:w-[65%] ">
            {file && (
              <div className="mb-2 bg-background">
                <div className="flex w-full flex-row items-center justify-between rounded-lg border-2 p-2">
                  <div className="flex w-9/12 flex-row items-end space-x-3 ">
                    <Icons.file className="w-1/12" />
                    <p className="w-11/12 truncate">{file.name}</p>
                  </div>
                  <div className="flex w-3/12 flex-row items-end justify-end space-x-3">
                    <p className="text-xs ">
                      {(file.size / 1000).toFixed(1)} kb
                    </p>

                    <Icons.cross
                      className="cursor-pointer"
                      onClick={handleRemoveFile}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="flex w-full flex-row">
              <div className="relative w-full">
                <FormTextInput
                  control={form.control}
                  name="message"
                  placeholder={t("chat.form.message_placeholder")}
                />

                <div className="absolute right-2 top-1/2  -translate-y-1/2 hover:bg-transparent">
                  <div className="flex flex-row items-center space-x-1">
                    {isLoading && <Icons.loader />}

                    {!file && (
                      <button
                        onClick={() => setIsFileUploadDrawerOpen(true)}
                        type="button"
                      >
                        <Icons.file className="cursor-pointer" />
                      </button>
                    )}
                    {(file || currentInputMessage) && !isLoading && (
                      <button type="submit" disabled={isLoading}>
                        <Icons.send />
                      </button>
                    )}
                  </div>
                  <FileUploadDrawer
                    isOpen={isFileUploadDrawerOpen}
                    onFileDrop={handleUpLoadFile}
                    onOpenChange={(open: boolean) =>
                      setIsFileUploadDrawerOpen(open)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </Form>
  )
}

export default SendMessageForm
