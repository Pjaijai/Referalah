import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { corsHeaders, ENV_IS_LOCAL } from "../_shared/cors.ts"
import { initSupabaseServer } from "../_shared/server.ts"
import { sendEmail } from "../_shared/modules/notification/email/send-email.ts"

const WEB_BASE_URL = Deno.env.get("WEB_BASE_URL")
serve(async (req: any) => {
  try {
    console.log(
      "Notify user unseen conversation at :",
      new Date().toISOString(),
    )
    const server = initSupabaseServer()

    const { key } = await req.json()

    const { data, error } = await server
      .from("config")
      .select("*")
      .eq("name", "cron_key")
      .single()

    if (key !== data.value)
      return new Response("Invalid Key", {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      })

    const { data: users } = await server.from("user").select("*")
    const resp: any[] = await Promise.all(
      users.map(async (user) => {
        const { data: conversations, error } = await server
          .from("conversation")
          .select(
            `
              sender_uuid(uuid,username, email),
              receiver_uuid(uuid,username, email),
              last_message_uuid(
                  sender_uuid,
                  body
              ),
              is_sender_seen,
              is_receiver_seen
            `,
          )
          .or(`sender_uuid.eq.${user.uuid},receiver_uuid.eq.${user.uuid}`)
          .order("last_updated_at", { ascending: false })

        const unseenConversationList: { username: string; body: string }[] = []

        for (let index = 0; index < conversations.length; index++) {
          const conversation = conversations[index]

          if (
            conversation.sender_uuid.uuid === user.uuid &&
            conversation.is_sender_seen === false &&
            index < 5
          ) {
            unseenConversationList.push({
              username: conversation.receiver_uuid.username,
              body: conversation.last_message_uuid.body,
            })
          } else if (
            conversation.receiver_uuid.uuid === user.uuid &&
            conversation.is_receiver_seen === false &&
            index < 5
          ) {
            unseenConversationList.push({
              username: conversation.sender_uuid.username,
              body: conversation.last_message_uuid.body,
            })
          } else {
            break
          }
        }

        if (unseenConversationList.length === 0) return undefined
        const count = unseenConversationList.length

        const subject = `You ${
          count === 1 ? "has" : "have"
        } ${count} unread message${
          count === 1 ? "" : "s"
        } | 你有${count}個未讀訊息 - Referalah`

        const body = `
        <html>
        <body>
          <p style="margin-bottom: 8px;">Hi ${user.username}!</p>
          <p style="margin-bottom: 8px;">You ${
            count === 1 ? "has" : "have"
          } ${count} unread message${
          count === 1 ? "" : "s"
        } | 你有${count}個未讀訊息</p>
          <p style="margin-bottom: 8px;">Please click the link below to continue the conversation:</p>
          <a href="${WEB_BASE_URL}/en-ca/chat" style="margin-bottom: 16px; display: block; text-decoration: none; color: #007bff;">${WEB_BASE_URL}/en-ca/chat</a>
      
        
          ${unseenConversationList
            .map(
              (con) => `
            <div style="width: 100%; display: flex; justify-content: center;  margin-top: 2rem;">
              <div style="width: 100%">
                <div style="width: 100% background: #eee; padding: 16px; border-radius: 8px;">
                  <p style="text-align: end; font-size: 14px; font-style: italic; margin-bottom: 8px;">${con.username}</p>
                  <p style="margin-top: 8px;">${con.body}</p>
                </div>
              </div>
            </div>
          `,
            )
            .join("")}
        
        </body>
      </html>
        `

        const res = await sendEmail({
          subject,
          body: body,
          to: ENV_IS_LOCAL ? Deno.env.get("RESEND_TO_EMAIL") : user.email,
        })

        return {
          success: res?.ok,
          to: user.email,
          time: new Date().toISOString(),
          user_uuid: user.uuid,
        }
      }),
    )

    const filteredResp = resp.filter((r) => r)
    return new Response(JSON.stringify(filteredResp), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, // Be sure to add CORS headers here too
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    })
  }
})
