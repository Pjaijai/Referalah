// local api url ip address is : 172.17.0.1
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { corsHeaders, ENV_IS_LOCAL } from "../_shared/cors.ts"
import { initSupabaseServer } from "../_shared/server.ts"
import { sendEmail } from "../_shared/modules/notification/email/send-email.ts"
import Bottleneck from "npm:bottleneck@2.19.5"

const WEB_BASE_URL = Deno.env.get("WEB_BASE_URL")
interface IUnSeenConversation {
  email: string
  username: string
  unseenList: { username: string; body: string }[]
}

interface Notification {
  user_uuid: string
  message_uuid: string
}

interface User {
  email: string
  username: string
}

interface EmailResult {
  success: boolean
  to: string
  time: string
}

serve(async (req: Request) => {
  try {
    console.log(
      "Notify user unseen conversation at :",
      new Date().toISOString(),
    )
    const server = initSupabaseServer()

    const { key }: { key: string } = await req.json()

    const { data, error }: { data: any; error: any } = await server
      .from("config")
      .select("*")
      .eq("name", "cron_key")
      .single()

    if (key !== data.value)
      return new Response("Invalid Key", {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      })

    const { data: notifications }: { data: Notification[] } = await server
      .from("message_notification_queue")
      .select("user_uuid, message_uuid")
      .eq("status", "pending")

    const userNotifications: Record<string, string[]> = notifications.reduce(
      (acc: Record<string, string[]>, notification: Notification) => {
        if (!acc[notification.user_uuid]) {
          acc[notification.user_uuid] = []
        }
        acc[notification.user_uuid].push(notification.message_uuid)
        return acc
      },
      {},
    )

    const limiter: Bottleneck = new Bottleneck({
      minTime: 180,
      maxConcurrent: 1,
    })

    const result: EmailResult[] = await Promise.all(
      Object.entries(userNotifications).map(
        async ([userUuid, messageUuids]: [string, string[]]) => {
          const { data: user }: { data: User } = await server
            .from("user")
            .select("email, username")
            .eq("uuid", userUuid)
            .single()

          const count: number = messageUuids.length

          const subject: string = `You ${
            count === 1 ? "have" : "have"
          } ${count} unread message${
            count === 1 ? "" : "s"
          } | 你有${count}個未讀訊息 - Referalah`

          const body: string = `
        <html>
          <body>
            <!-- Email body HTML -->
          </body>
        </html>
        `
          console.log(123, subject)
          let emailResult: EmailResult = {
            success: false,
            to: "",
            time: "",
          }

          try {
            const res: { ok?: boolean } = await limiter.schedule(() =>
              sendEmail({
                subject,
                body: body,
                to: ENV_IS_LOCAL ? Deno.env.get("RESEND_TO_EMAIL") : user.email,
              }),
            )

            emailResult = {
              success: res?.ok || false,
              to: user.email,
              time: new Date().toISOString(),
            }

            if (res?.ok) {
              await server
                .from("message_notification_queue")
                .update({ status: "sent" })
                .in("message_uuid", messageUuids)
            } else {
              await server
                .from("message_notification_queue")
                .update({ status: "failed" })
                .in("message_uuid", messageUuids)
            }
          } catch (error) {
            console.error(`Error sending email to ${user.email}:`, error)

            await server
              .from("message_notification_queue")
              .update({ status: "failed" })
              .in("message_uuid", messageUuids)

            emailResult = {
              success: false,
              to: user.email,
              time: new Date().toISOString(),
            }
          }

          return emailResult
        },
      ),
    )

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    })
  }
})
