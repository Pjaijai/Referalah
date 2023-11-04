import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

import { initSupabaseClient } from "../_shared/client.ts"
import { corsHeaders, ENV_IS_LOCAL } from "../_shared/cors.ts"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
const WEB_BASE_URL = Deno.env.get("WEB_BASE_URL")
serve(async (req: any) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders })
    }

    // // N
    const client = initSupabaseClient(req)

    const { type, message, to_uuid } = await req.json()

    if (!type) {
      return new Response("Missing type", {
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

    if (!to_uuid) {
      return new Response("Missing to_uuid", {
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

    // Function code here ...

    const {
      data: { user },
    } = await client.auth.getUser()

    const { data: sender, error } = await client
      .from("user")
      .select("*")
      .eq("uuid", user.id)
      .single()

    const { data: receiver } = await client
      .from("user")
      .select("*")
      .eq("uuid", to_uuid)
      .single()

    if (!sender) {
      return new Response("Sender does not exits", {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      })
    }

    if (!receiver) {
      return new Response("Receiver not exits", {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      })
    }

    if (sender.uuid === receiver.uuid) {
      return new Response("Same user", {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      })
    }

    if (type === "referer" && receiver.is_referer === false) {
      return new Response("Receiver is not referer", {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      })
    }

    if (type === "referee" && receiver.is_referee === false) {
      return new Response("Receiver is not referee", {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      })
    }

    const subject = `${sender.username} 想搵你做${
      type === "referer" ? "推薦人" : "受薦人"
    }`
    const body = `
      <html lang="zh-Hk">
      <body>
          <p>Hi ${receiver.username}!</p>
          <p>${sender.username} send咗個訊息俾你。</p>
          <p>佢個電郵地址: ${sender.email} (回覆此Email可以直接聯絡對方)</p>
          <p>佢個個人檔案: <a href="${WEB_BASE_URL}/profile/${user.uuid}">${WEB_BASE_URL}/profile/${user.uuid}</a></p>
          <p>佢個訊息</p>
          <div id="emailContent" style="word-break: break-word; white-space: pre-wrap;">
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
        to: ENV_IS_LOCAL ? Deno.env.get("RESEND_TO_EMAIL") : receiver.email,
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
      .from("referral_contact_history")
      .insert({
        sender_uuid: sender.uuid,
        receiver_uuid: receiver.uuid,
        type: type,
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
