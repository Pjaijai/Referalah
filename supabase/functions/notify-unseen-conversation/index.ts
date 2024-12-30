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
  notification_permissions: string[]
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
            .select("email, username, notification_permissions")
            .eq("uuid", userUuid)
            .single()

          const count: number = messageUuids.length

          // Early return if user doesn't have permission for unseen_message notifications
          if (
            !user.notification_permissions ||
            !user.notification_permissions.includes("unseen_message")
          ) {
            await server
              .from("message_notification_queue")
              .update({ status: "no_permission" })
              .in("message_uuid", messageUuids)

            return {
              success: false,
              to: user.email,
              time: new Date().toISOString(),
              status: "no_permission",
            }
          }

          const subject: string = `You ${
            count === 1 ? "have" : "have"
          } ${count} message${
            count === 1 ? "" : "s"
          } today | 你今日有${count}個訊息 | Referalah`

          const body: string = `
            <html>
            <body style="font-family: Arial, sans-serif; background-color: #f8fafc; color: #000; margin: 0; padding: 20px;">
                <p style="text-align: left; color: #4f46e5; font-size: 18px; margin-top: 20px;">Hi ${
                  user.username
                },</p>
    
                <div style="text-align: center; margin-bottom: 20px;">
                    <p style="line-height: 1.6;">You have ${count} message${
            count === 1 ? "" : "s"
          } today on Referalah!</p>
                    <p style="line-height: 1.6;">你今日喺 Referalah 收到${count}個訊息！</p>
                </div>
    
                <p style="text-align: center; line-height: 1.6;">If you want to stop receiving this kind of email, please go to your profile page and adjust your settings.</p>
                <p style="text-align: center; line-height: 1.6;">如果你想停止接收呢類電郵，可以去個人檔案設定。</p>
    
                <p style="text-align: left; line-height: 1.6; margin-top: 20px;">Cheers,<br>Paul@Referalah</p>
            </body>
            </html>
          `

          try {
            const res: { ok?: boolean } = await limiter.schedule(() =>
              sendEmail({
                subject,
                body: body,
                to: ENV_IS_LOCAL ? Deno.env.get("RESEND_TO_EMAIL") : user.email,
              }),
            )

            if (!res?.ok) {
              await server
                .from("message_notification_queue")
                .update({ status: "failed" })
                .in("message_uuid", messageUuids)

              return {
                success: false,
                to: user.email,
                time: new Date().toISOString(),
              }
            }

            // Log successful notification
            await server.from("email_notification_log").insert({
              user_uuid: userUuid,
              email: user.email,
              type: "unseen_message",
              title: subject,
              body: body,
            })

            // Remove successfully sent notifications from the queue
            await server
              .from("message_notification_queue")
              .delete()
              .in("message_uuid", messageUuids)

            return {
              success: true,
              to: user.email,
              time: new Date().toISOString(),
            }
          } catch (error) {
            console.error(`Error sending email to ${user.email}:`, error)

            await server
              .from("message_notification_queue")
              .update({ status: "failed" })
              .in("message_uuid", messageUuids)

            return {
              success: false,
              to: user.email,
              time: new Date().toISOString(),
            }
          }
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
