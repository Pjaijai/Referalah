// local api url ip address is : 172.17.0.1
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { corsHeaders, ENV_IS_LOCAL } from "../_shared/cors.ts"
import { initSupabaseServer } from "../_shared/server.ts"
import { sendEmail } from "../_shared/modules/notification/email/send-email.ts"
import Bottleneck from "npm:bottleneck@2.19.5"

interface Notification {
  id: number
  user_uuid: string
  type: string
  data: any
  is_seen: boolean
  created_at: string
  email_notified_at: string | null
}

interface User {
  email: string
  username: string
  notification_permissions: string[]
  uuid: string // Ensure User interface includes uuid
}

interface EmailResult {
  success: boolean
  to: string
  time: string
}

serve(async (req: Request) => {
  try {
    console.log("Checking notifications at:", new Date().toISOString())
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

    // Define the current time at the beginning of the function
    const currentTime = new Date()
    const currentTimeISO = currentTime.toISOString()

    // Calculate the time 24 hours ago based on the defined current time
    const twelveHoursAgo = new Date(
      currentTime.getTime() - 24 * 60 * 60 * 1000,
    ).toISOString()

    // Fetch unseen notifications created within the last 24 hours, but not after current time
    const {
      data: notifications,
      error: notificationError,
    }: { data: Notification[]; error: any } = await server
      .from("notification")
      .select("*")
      .eq("is_seen", false)
      .gte("created_at", twelveHoursAgo) // Greater than or equal to 24 hours ago
      .lt("created_at", currentTimeISO) // Less than current time

    if (notificationError) {
      console.error("Error fetching notifications:", notificationError)
      return new Response(
        JSON.stringify({ error: "Failed to fetch notifications" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      )
    }

    // Group notifications by user_uuid
    const userNotifications: Record<string, Notification[]> =
      notifications.reduce(
        (acc: Record<string, Notification[]>, notification: Notification) => {
          if (!acc[notification.user_uuid]) {
            acc[notification.user_uuid] = []
          }
          acc[notification.user_uuid].push(notification)
          return acc
        },
        {},
      )

    // Fetch all unique user UUIDs
    const userUUIDs = Object.keys(userNotifications)

    // Fetch all user data in one go
    const {
      data: users,
      error: usersError,
    }: { data: User[] | null; error: any } = await server
      .from("user")
      .select("email, username, notification_permissions, uuid")
      .in("uuid", userUUIDs)

    if (usersError) {
      console.error("Error fetching users:", usersError)
      return new Response(JSON.stringify({ error: "Failed to fetch users" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      })
    }

    // Create a map of user UUID to user data
    const userMap: Map<string, User> = new Map()
    if (users) {
      users.forEach((user) => {
        userMap.set(user.uuid, user)
      })
    }

    const limiter: Bottleneck = new Bottleneck({
      minTime: 180,
      maxConcurrent: 1,
    })

    const result: EmailResult[] = await Promise.all(
      Object.entries(userNotifications).map(
        async ([userUuid, notifications]: [string, Notification[]]) => {
          // Retrieve user data from the map
          const user = userMap.get(userUuid)

          if (!user) {
            console.error(`User not found for UUID: ${userUuid}`)
            return {
              success: false,
              to: "unknown",
              time: new Date().toISOString(),
            }
          }

          const count: number = notifications.length

          // Early return if user doesn't have permission for unseen_message notifications
          if (
            !user.notification_permissions ||
            !user.notification_permissions.includes("unseen_message")
          ) {
            return {
              success: false,
              to: user.email,
              time: new Date().toISOString(),
            }
          }
          const subject: string = `Today you have ${count} notification${
            count === 1 ? "" : "s"
          } waiting for you | 今天有${count}條未讀通知等緊你`

          const body: string = `
            <html>
            <body style="font-family: Arial, sans-serif; background-color: #f8fafc; color: #000; margin: 0; padding: 20px;">
                <p style="text-align: left; color: #4f46e5; font-size: 18px; margin-top: 20px;">Hi ${
                  user.username
                },</p>
    
                <div style="text-align: center; margin-bottom: 20px;">
                    <p style="line-height: 1.6;">Today you have ${count} notification${
            count === 1 ? "" : "s"
          } on Referalah!</p>
                    <p style="line-height: 1.6;">今日你喺 Referalah 有${count}條未讀通知等緊你!</p>
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
                body,
                to: ENV_IS_LOCAL ? Deno.env.get("RESEND_TO_EMAIL") : user.email,
              }),
            )

            if (!res?.ok) {
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
              body,
            })

            return {
              success: true,
              to: user.email,
              time: new Date().toISOString(),
            }
          } catch (error) {
            console.error(`Error sending email to ${user.email}:`, error)

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
    console.error("Global error:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    })
  }
})
