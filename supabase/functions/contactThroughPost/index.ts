import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

import { initSupabaseClient } from "../_shared/client.ts"
import { corsHeaders } from "../_shared/cors.ts"

const RESEND_API_KEY = Deno.env.get("SUPABASE_RESEND_API_KEY")

serve(async (req: any) => {
  console.log(
    "getting1",
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_ANON_KEY")
  )
  console.log(
    "getting",
    RESEND_API_KEY,
    Deno.env.get("SUPABASE_RESEND_API_KEY")
  )
  //   const client = initSupabaseClient(req)

  //   if (req.method === "OPTIONS") {
  //     return new Response("ok", { headers: corsHeaders })
  //   }
  //   const { type, message, post_uuid } = await req.json()

  //   if (!type) {
  //     return new Response("Missing type", {
  //       headers: { ...corsHeaders, "Content-Type": "application/json" },
  //       status: 400,
  //     })
  //   }

  //   if (!message) {
  //     return new Response("Missing Message", {
  //       headers: { ...corsHeaders, "Content-Type": "application/json" },
  //       status: 400,
  //     })
  //   }

  //   if (!post_uuid) {
  //     return new Response("Missing post uuid", {
  //       headers: { ...corsHeaders, "Content-Type": "application/json" },
  //       status: 400,
  //     })
  //   }

  //   if (message.length > 3000) {
  //     return new Response("Message too long", {
  //       headers: { ...corsHeaders, "Content-Type": "application/json" },
  //       status: 400,
  //     })
  //   }

  //   try {
  //     // Function code here ...
  //     const {
  //       data: { user },
  //     } = await client.auth.getUser()

  //     const { data: sender, error } = await client
  //       .from("user")
  //       .select("*")
  //       .eq("uuid", user.id)
  //       .single()

  //     const { data: post } = await client
  //       .from("post")
  //       .select(
  //         `
  //         user(
  //             username,
  //             email
  //         ),
  //         job_title,
  //         description,
  //         url
  // `
  //       )
  //       .eq("uuid", post_uuid)
  //       .single()

  //     console.log("receiver", post)

  //     if (!sender) {
  //       return new Response("Sender does not exits", {
  //         headers: { ...corsHeaders, "Content-Type": "application/json" },
  //         status: 404,
  //       })
  //     }

  //     if (!post) {
  //       return new Response("Post not exits", {
  //         headers: { ...corsHeaders, "Content-Type": "application/json" },
  //         status: 404,
  //       })
  //     }

  //     let subject
  //     let body

  //     if (type === "referer") {
  //       subject = `${sender.username} 想搵你幫手做推薦人`
  //       body = `
  //       <html lang="zh-Hk">
  //       <body>
  //           <p>Dear <span id="receiverUsername">${post.user.username}</span>,</p>
  //           <p>You have received an email from <span id="senderUsername">${sender.username}</span>.</p>
  //           <p>Email content: ${sender.email}</p>
  //           <div id="emailContent" style="word-break: break-word; white-space: pre-wrap;">
  //               <!-- Email content goes here -->
  //               ${post.description}
  //           </div>
  //           <p>Thank you for using our service.</p>
  //       </body>
  //       </html>
  //       `
  //     }

  //     if (type === "referee") {
  //       subject = `${sender.username} 想搵你幫手做受薦人`
  //       body = `
  //       <html lang="zh-Hk">
  //       <body>
  //           <p>Dear <span id="receiverUsername">${post.username}</span>,</p>
  //           <p>You have received an email from <span id="senderUsername">${sender.username}</span> (<span id="senderEmail">[Sender's Email]</span>).</p>
  //           <p>Email content: ${sender.email}</p>
  //           <div id="emailContent" style="word-break: break-word; white-space: pre-wrap;">
  //               <!-- Email content goes here -->
  //               ${post.description}
  //           </div>
  //           <p>Thank you for using our service.</p>
  //       </body>
  //       </html>
  //       `
  //     }

  //     console.log("emaiasd", RESEND_API_KEY)
  //     const res = await fetch("https://api.resend.com/emails", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${RESEND_API_KEY}`,
  //       },
  //       body: JSON.stringify({
  //         from: "onboarding@resend.dev",
  //         to: "pwongct2000@gmail.com",
  //         subject: subject,
  //         html: body,
  //       }),
  //     })

  //     console.log(123123, res)
  //     if (res.ok === false) {
  //       return new Response("Failed to send email", {
  //         headers: { ...corsHeaders, "Content-Type": "application/json" },
  //         status: 400,
  //       })
  // }

  //     return new Response(JSON.stringify("success"), {
  //       headers: { ...corsHeaders, "Content-Type": "application/json" }, // Be sure to add CORS headers here too
  //       status: 200,
  //     })
  //   } catch (error: any) {
  //     return new Response(JSON.stringify({ error }), {
  //       headers: { ...corsHeaders, "Content-Type": "application/json" },
  //       status: 400,
  //     })
  //   }
})
