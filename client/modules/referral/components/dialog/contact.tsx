"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/utils/services/internationalization/client"
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
  const t = useI18n()
  const formSchema = z.object({
    message: z
      .string()
      .max(3000, {
        message: t("validation.text.maximum_length", { count: 3000 }),
      })
      .min(1, {
        message: t("validation.text.minimum_length", { count: 1 }),
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
                title: t("referral.form.contact.error.title"),
                description: t("referral.form.contact.error.description"),
                variant: "destructive",
              })
            },
            onSuccess: (res) => {
              onContactFormClose()
              reset()
              return toast({
                title: t("referral.form.contact.success_title"),
                description: t("referral.form.contact.success_description"),
                action: (
                  <ToastAction
                    onClick={() => handleCheckClick(res.conversation_uuid)}
                    altText="Check"
                  >
                    {t("general.view")}
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
                title: t("referral.form.contact.error.title"),
                description: t("referral.form.contact.error.description"),
                variant: "destructive",
              })
            },
            onSuccess: (res) => {
              onContactFormClose()
              reset()
              return toast({
                title: t("referral.form.contact.success_title"),
                description: t("referral.form.contact.success_description"),
                action: (
                  <ToastAction
                    onClick={() => handleCheckClick(res.conversation_uuid)}
                    altText="Check"
                  >
                    {t("general.view")}
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
        title: t("referral.form.contact.error.title"),
        description: t("referral.form.contact.error.description"),
        variant: "destructive",
      })
    }
  }
  return (
    <Dialog open={open}>
      <DialogContent className="w-full md:w-1/2">
        <DialogHeader>
          <DialogTitle>
            {t("referral.form.send_message_to")} {username}
          </DialogTitle>

          {receiverType === "referer" && messageType === "referral" && (
            <>
              <DialogDescription>
                {t("referral.form.find_job_in_advance_reminder")}
              </DialogDescription>

              <span className="text-sm font-semibold text-red-500">
                {t("referral.form.ai_warning")}
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
                    <FormLabel>{t("referral.form.message_label")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={
                          receiverType === "referer"
                            ? t("referral.form.message_placeholder")
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
                {t("referral.form.cancel")}
              </Button>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? t("general.wait") : t("referral.form.submit")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
export default ContactDialog
