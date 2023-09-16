import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

import { initSupabaseClient } from "../_shared/client.ts"
import { corsHeaders } from "../_shared/cors.ts"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")

serve(async (req: any) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }
  const client = initSupabaseClient(req)
  const { message, post_uuid } = await req.json()

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
    let subject
    let body
    if (post.type === "referer") {
      subject = `${sender.username} 想搵你幫手做推薦人2`
      body = `
            <html lang="zh-Hk">
            <body>
                <p>Dear <span id="receiverUsername">${post.user.username}</span>,</p>
                <p>You have received an email from <span id="senderUsername">${sender.username}</span>.</p>
                <p>Email content: ${sender.email}</p>
                <div id="emailContent" style="word-break: break-word; white-space: pre-wrap;">
                    <!-- Email content goes here -->
                    ${post.description}
                </div>
                <p>Thank you for using our service.</p>
            </body>
            </html>
            `
    }
    if (post.type === "referee") {
      subject = `${sender.username} 想搵你幫手做受薦人1`
      body = `
            <html lang="zh-Hk">
            <body>
                <p>Dear <span id="receiverUsername">${post.username}</span>,</p>
                <p>You have received an email from <span id="senderUsername">${sender.username}</span> (<span id="senderEmail">[Sender's Email]</span>).</p>
                <p>Email content: ${sender.email}</p>
                <div id="emailContent" style="word-break: break-word; white-space: pre-wrap;">
                    <!-- Email content goes here -->
                    ${post.description}
                </div>
                <p>Thank you for using our service.</p>
            </body>
            </html>
            `
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: post.user.email,
        subject: subject,
        html: body,
      }),
    })

    if (res.ok === false) {
      return new Response("Failed to send email", {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      })
    }
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
