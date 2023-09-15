import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

import { initSupabaseClient } from "../_shared/client.ts"
import { corsHeaders } from "../_shared/cors.ts"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")

// TODO add email record
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

    let subject
    let body

    if (type === "referer") {
      subject = `${sender.username} 想搵你幫手做推薦人`
      body = `
      <html lang="zh-Hk">
      <body>
          <p>Dear <span id="receiverUsername">${receiver.username}</span>,</p>
          <p>You have received an email from <span id="senderUsername">${sender.username}</span>.</p>
          <p>Email content: ${sender.email}</p>
          <div id="emailContent" style="word-break: break-word; white-space: pre-wrap;">
              <!-- Email content goes here -->
              ${message}
          </div>
          <p>Thank you for using our service.</p>
      </body>
      </html>
      `
    }

    if (type === "referee") {
      subject = `${sender.username} 想搵你幫手做受薦人`
      body = `
      <html lang="zh-Hk">
      <body>
          <p>Dear <span id="receiverUsername">${receiver.username}</span>,</p>
          <p>You have received an email from <span id="senderUsername">${sender.username}</span> (<span id="senderEmail">[Sender's Email]</span>).</p>
          <p>Email content: ${sender.email}</p>
          <div id="emailContent" style="word-break: break-word; white-space: pre-wrap;">
              <!-- Email content goes here -->
              ${message}
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
        to: receiver.email,
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
