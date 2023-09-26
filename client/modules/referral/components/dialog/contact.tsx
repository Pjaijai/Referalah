import { useState } from "react"
import { supabase } from "@/utils/services/supabase/config"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { useToast } from "@/components/ui/use-toast"

export interface IContactDialogProps {
  open: boolean
  username: string
  onContactFormClose: () => void
  messageType: "post" | "referral"
  receiverType?: "referer" | "referee"
  toUuid: string | null
  postUuid: string | null
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
  const { toast } = useToast()
  const {
    formState: { errors },
    reset,
  } = form

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    try {
      setIsLoading(true)
      if (messageType === "referral") {
        const { data, error } = await supabase.functions.invoke(
          "contact-referral",
          {
            body: {
              type: receiverType,
              message: values.message,
              to_uuid: toUuid,
            },
          }
        )

        if (error) {
          return toast({
            title: "Send不到，哭咗🥲",
            description: "好似有啲錯誤，如果試多幾次都係咁，請聯絡我🙏🏻",
            variant: "destructive",
          })
        }
      } else {
        const { data, error } = await supabase.functions.invoke(
          "contact-through-post",
          {
            body: {
              message: values.message,
              post_uuid: postUuid,
            },
          }
        )

        if (error) {
          return toast({
            title: "Send不到，哭咗🥲",
            description: "好似有啲錯誤，如果試多幾次都係咁，請聯絡我🙏🏻",
            variant: "destructive",
          })
        }
      }

      toast({
        title: "成功！！！！！！！",
        description: "祝一切順利！",
      })

      onContactFormClose()
    } catch (err) {
      return toast({
        title: "Send不到，哭咗🥲",
        description: "好似有啲錯誤，如果試多幾次都係咁，請聯絡我🙏🏻",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      reset()
    }
  }
  return (
    <Dialog open={open}>
      <DialogContent className="w-full md:w-[350px]">
        <DialogHeader>
          <DialogTitle>Send信息俾 {username}</DialogTitle>
          <DialogDescription>注意: 你個Email 會send埋俾對方</DialogDescription>
          {receiverType === "referer" && messageType === "referral" && (
            <DialogDescription>
              提示: 搵對方前，建議搵定個Job post射俾對方，推薦人冇義務幫你搵工。
            </DialogDescription>
          )}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"信息"}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
