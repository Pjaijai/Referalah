import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

import { initSupabaseClient } from "../_shared/client.ts"
import { corsHeaders, ENV_IS_LOCAL } from "../_shared/cors.ts"
import { EPostStatus } from "../_shared/types/enums/post/status.ts"
import { initSupabaseServer } from "../_shared/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
const WEB_BASE_URL = Deno.env.get("WEB_BASE_URL")

serve(async (req: any) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders })
    }

    const client = initSupabaseClient(req)
    const server = initSupabaseServer()

    const jwt = req.headers.get("Authorization")!.split(" ")[1]

    const { post_uuid, body: msgBody, document } = await req.json()

    if (!client) {
      return new Response("User not signed in", {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      })
    }

    if (!msgBody) {
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
    if (msgBody.length > 4000) {
      return new Response("Message too long", {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      })
    }

    const {
      data: { user },
    } = await server.auth.getUser(jwt)

    const { data: sender, error } = await server
      .from("user")
      .select("uuid,username, email,status")
      .eq("uuid", user.id)
      .single()

    const { data: post, error: postError } = await server
      .from("post")
      .select(
        `   type,
              user(
                email,
                  uuid,
                  username
              ),
              
              company_name,
              job_title,
              description,
              url,
              uuid,
              contact_request_count
      `,
      )
      .eq("uuid", post_uuid)
      .single()

    if (!sender) {
      return new Response("Sender does not exits", {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      })
    }

    console.log(sender.status, sender.status !== "active")

    if (sender.status !== "active") {
      return new Response("Not allowed to contact", {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      })
    }

    if (!post) {
      return new Response("Post does not exits", {
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

    const { data: conversation } = await server.rpc("find_conversation", {
      user1_uuid: sender.uuid,
      user2_uuid: post.user.uuid,
    })

    let conversationUuid
    let messageUuid

    const newMsgBody = `
    Post Title/街招 :${post.job_title}
    company/公司 :${post.company_name}

    ${msgBody}
    `

    if (!conversation[0]) {
      const { data: insertConversationRes, error: insertConversationError } =
        await server
          .from("conversation")
          .insert({ sender_uuid: sender.uuid, receiver_uuid: post.user.uuid })
          .select()
          .single()
      conversationUuid = insertConversationRes.uuid

      const { data: insertMessageRes, error: insertMessageError } = await server
        .from("message")
        .insert({
          sender_uuid: sender.uuid,
          conversation_uuid: insertConversationRes.uuid,
          body: newMsgBody,
          document: document,
        })
        .select()
        .single()

      messageUuid = insertMessageRes.uuid

      const { updateConversationRes, error: updateConversationError } =
        await server
          .from("conversation")
          .update({ last_message_uuid: insertMessageRes.uuid })
          .eq("uuid", insertConversationRes.uuid)

      console.log(
        `Created conversation uuid:${insertConversationRes.uuid} for ${sender.uuid} and ${post.user.uuid}`,
      )
    } else {
      if (conversation[0].is_receiver_accepted === false)
        return new Response("Receiver has not accepted the conversation", {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        })

      conversationUuid = conversation[0].uuid
      const { data: message } = await server
        .from("message")
        .insert({
          sender_uuid: sender.uuid,
          conversation_uuid: conversation[0].uuid,
          body: newMsgBody,
          document: document,
        })
        .select()
        .single()

      const { data, error } = await server
        .from("conversation")
        .update({ last_message_uuid: message.uuid })
        .eq("uuid", conversation[0].uuid)
        .select()
        .single()

      messageUuid = message.uuid

      console.log(
        `Existing conversation uuid:${data.uuid} for ${sender.uuid} and ${post.user.uuid}. Inserting message: uuid${message.uuid}`,
      )
    }

    const { data: record, error: err } = await server
      .from("post_contact_history")
      .insert({
        sender_uuid: sender.uuid,
        post_uuid: post.uuid,
        type: post.type,
        message_uuid: messageUuid,
      })

    const { data: updatePostCount } = await server
      .from("post")
      .update({ contact_request_count: post.contact_request_count + 1 })
      .eq("uuid", post.uuid)
      .single()

    const subject = `${sender.username} is interested in you post - ${post.job_title}`
    const body = `
            <html>
           
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Message about Your Post</title>
</head>

<body style="font-family: 'Arial', sans-serif; background-color: #f8f8f8; margin: 0; padding: 20px; text-align: center;">

<p style="margin: 8px 0; font-size: 18px; color: #333;">Hi ${post.user.username}!</p>
<p style="margin: 8px 0; font-size: 16px; color: #333;">${sender.username} sent you a message about your post: ${post.job_title}</p>
<p style="margin: 8px 0; font-size: 16px; color: #333;">Post's link: <a href="${WEB_BASE_URL}/en-ca/post/referer/${post.uuid}" style="color: #007bff; text-decoration: none; font-weight: bold;">${WEB_BASE_URL}/en-ca/post/referer/${post.uuid}</a></p>
<p style="margin: 8px 0; font-size: 16px; color: #333;">Job Title: ${post.job_title}</p>
<p style="margin: 8px 0; font-size: 16px; color: #333;">Company: ${post.company_name}</p>
<p style="margin: 8px 0; font-size: 16px; color: #333;">${sender.username}'s profile: <a href="${WEB_BASE_URL}/en-ca/profile/${sender.uuid}" style="color: #007bff; text-decoration: none; font-weight: bold;">${WEB_BASE_URL}/profile/en-ca/${sender.uuid}</a></p>
<p style="margin: 8px 0; font-size: 16px; color: #333;">Please click the link below to continue the conversation:</p>
<a href="${WEB_BASE_URL}en-ca/chat?conversation=${conversationUuid}" style="color: #007bff; text-decoration: none; font-weight: bold;">${WEB_BASE_URL}/en-ca/chat?conversation=${conversationUuid}</a>

<div style="display: flex; justify-content: center; margin-top: 20px;">
    <div style="background-color: #eee; padding: 16px; border-radius: 8px; max-width: 600px; width: 100%; word-wrap: break-word; white-space: pre-wrap;">
        <p style="margin-top: 8px; font-size: 16px; color: #333;">${msgBody}</p>
    </div>
</div>

</body>

            </html>
            `

    const sendEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: ENV_IS_LOCAL
          ? "onboarding@resend.dev"
          : "Referalah <team@referalah.com>",
        to: ENV_IS_LOCAL ? Deno.env.get("RESEND_TO_EMAIL") : post.user.email,
        subject: subject,
        html: body,
      }),
    })

    if (sendEmailRes.ok === false) {
      return new Response("Failed to send email", {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      })
    }

    const res = {
      data: {
        conversation_uuid: conversationUuid,
      },
      success: true,
    }

    return new Response(JSON.stringify(res), {
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
