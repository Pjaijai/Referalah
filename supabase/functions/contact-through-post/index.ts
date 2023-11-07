import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

import { initSupabaseClient } from "../_shared/client.ts"
import { corsHeaders, ENV_IS_LOCAL } from "../_shared/cors.ts"
import { EPostStatus } from "../_shared/types/post/status.ts"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
const WEB_BASE_URL = Deno.env.get("WEB_BASE_URL")
serve(async (req: any) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }
  const client = initSupabaseClient(req)
  const { message, post_uuid } = await req.json()

  if (!client) {
    return new Response("User not signed in", {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    })
  }

  if (!message) {
    return new Response("Missing Message", {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    })
  }
  if (!post_uuid) {
    return new Response("Missing post uuid", {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    })
  }
  if (message.length > 3000) {
    return new Response("Message too long", {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    })
  }
  try {
    const {
      data: { user },
    } = await client.auth.getUser()

    const { data: sender, error } = await client
      .from("user")
      .select("*")
      .eq("uuid", user.id)
      .single()

    const { data: post } = await client
      .from("post")
      .select(
        `   type,
              user(
                  username,
                  email
              ),
              company_name,
              job_title,
              description,
              url,
              uuid
      `
      )
      .eq("uuid", post_uuid)
      .single()

    if (!sender) {
      return new Response("Sender does not exits", {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      })
    }
    if (!post) {
      return new Response("Post not exits", {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      })
    }

    if (sender.uuid === post.user.uuid) {
      return new Response("Same user", {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      })
    }

    if (post.status === EPostStatus.INACTIVE) {
      return new Response("Post is closed", {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      })
    }

    const subject = `${sender.username}對你份街招有興趣`
    const body = `
            <html lang="zh-Hk">
            <body>
                <p>Hi ${post.user.username}!</p>
                <p>${sender.username}對你份街招有興趣</p>
                <p>街招連結:<a href="${WEB_BASE_URL}/post/referer/${post.uuid}">${WEB_BASE_URL}/post/referer/${post.uuid}</a></p>
                <p>職位: ${post.job_title}</p>
                <p>公司名稱: ${post.company_name}</p>
                <p>佢嘅電郵地址: ${sender.email} (回覆此Email可以直接聯絡對方)</p>
                <p>佢嘅個人檔案: <a href="${WEB_BASE_URL}/profile/${user.uuid}">${WEB_BASE_URL}/profile/${user.uuid}</a></p>
               
                <p>佢個訊息</p>
                <div style="word-break: break-word; white-space: pre-wrap;">
                    ${message}
                </div>

                  <p>溫馨提示：保持警覺，祝大家順利！</p>
            </body>
            </html>
            `

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: ENV_IS_LOCAL
          ? "onboarding@resend.dev"
          : "Referalah <team@referalah.com>",
        reply_to: sender.email,
        to: ENV_IS_LOCAL ? Deno.env.get("RESEND_TO_EMAIL") : post.user.email,
        subject: subject,
        html: body,
        cc: [sender.email],
      }),
    })

    if (res.ok === false) {
      return new Response("Failed to send email", {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      })
    }

    const { error: insertError } = await client
      .from("post_contact_history")
      .insert({
        post_uuid: post.uuid,
        sender_uuid: sender.uuid,
        type: post.type,
        message: message,
      })

    return new Response(JSON.stringify("success"), {
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
