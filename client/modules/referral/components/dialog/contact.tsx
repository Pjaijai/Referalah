"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { EMessageType } from "@/types/common/message-type"
import { EReferralType } from "@/types/common/referral-type"
import { siteConfig } from "@/config/site"
import useMessagePostCreator from "@/hooks/api/message/post-creator"
import useMessageReferral from "@/hooks/api/message/referral"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export interface IContactDialogProps {
  open: boolean
  username: string | null
  onContactFormClose: () => void
  messageType: EMessageType
  receiverType?: EReferralType
  toUuid: string | null
  postUuid?: string | null
}

const ContactDialog: React.FunctionComponent<IContactDialogProps> = ({
  open,
  username,
  onContactFormClose,
  receiverType,
  messageType,
  toUuid,
  postUuid,
}) => {
  const formSchema = z.object({
    message: z
      .string()
      .max(3000, {
        message: `俾盡3000粒字，唔夠用請聯絡我🙏🏻`,
      })
      .min(1, {
        message: `至少有要1粒字`,
      }),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const { mutate: messageReferral } = useMessageReferral()
  const { mutate: messagePostCreator } = useMessagePostCreator()

  const { toast } = useToast()
  const {
    formState: { errors },
    reset,
  } = form

  const handleCheckClick = (uuid: string) => {
    const param = new URLSearchParams()
    param.set("conversation", uuid)
    router.push(siteConfig.page.chat.href + "?" + param.toString())
  }
  const onSubmit = async (values: z.infer<typeof formSchema>, e: any) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    e.preventDefault()
    try {
      setIsLoading(true)
      if (messageType === "referral") {
        messageReferral(
          {
            type: receiverType!,
            body: values.message,
            toUuid: toUuid!,
          },
          {
            onError: () => {
              return toast({
                title: "Send不到，哭咗🥲",
                description: "好似有啲錯誤，如果試多幾次都係咁，請聯絡我🙏🏻",
                variant: "destructive",
              })
            },
            onSuccess: (res) => {
              onContactFormClose()
              reset()
              return toast({
                title: "訊息已送出!",
                description: "祝一切順利！",
                action: (
                  <ToastAction
                    onClick={() => handleCheckClick(res.conversation_uuid)}
                    altText="Check"
                  >
                    查看
                  </ToastAction>
                ),
              })
            },
            onSettled: () => {
              setIsLoading(false)
            },
          }
        )
      } else {
        messagePostCreator(
          {
            body: values.message,
            postUuid: postUuid!,
          },
          {
            onError: () => {
              return toast({
                title: "Send不到，哭咗🥲",
                description: "好似有啲錯誤，如果試多幾次都係咁，請聯絡我🙏🏻",
                variant: "destructive",
              })
            },
            onSuccess: (res) => {
              onContactFormClose()
              reset()
              return toast({
                title: "成功！！！！！！！",
                description: "祝一切順利！",
                action: (
                  <ToastAction
                    onClick={() => handleCheckClick(res.conversation_uuid)}
                    altText="Check"
                  >
                    查看
                  </ToastAction>
                ),
              })
            },
            onSettled: () => {
              setIsLoading(false)
            },
          }
        )
      }
    } catch (err) {
      return toast({
        title: "Send不到，哭咗🥲",
        description: "好似有啲錯誤，如果試多幾次都係咁，請聯絡我🙏🏻",
        variant: "destructive",
      })
    }
  }
  return (
    <Dialog open={open}>
      <DialogContent className="w-full md:w-1/2">
        <DialogHeader>
          <DialogTitle>Send信息俾 {username}</DialogTitle>

          {receiverType === "referer" && messageType === "referral" && (
            <>
              <DialogDescription>
                提示: 搵對方前，建議搵定個Job
                post射俾對方，推薦人冇義務幫你搵工。
              </DialogDescription>

              <span className="text-sm font-semibold text-red-500">
                警告 : 使用AI代寫會大幅降低成功機會。
              </span>
            </>
          )}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{"信息"}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={
                          receiverType === "referer"
                            ? `- 自我介紹\n- 想見邊份工？\n- 點聯絡你？
                      `
                            : ""
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-4">
              <Button
                onClick={onContactFormClose}
                type="button"
                variant={"ghost"}
              >
                都係算
              </Button>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "請等等" : "傳送"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
export default ContactDialog
