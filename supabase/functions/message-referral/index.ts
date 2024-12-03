import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

import { initSupabaseClient } from "../_shared/client.ts"
import { corsHeaders, ENV_IS_LOCAL } from "../_shared/cors.ts"
import { initSupabaseServer } from "../_shared/server.ts"
import { IMessageReferralRequest } from "../_shared/types/request/message-referral.ts"

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
    const {
      type,
      body: msgBody,
      to_uuid,
      document,
    }: IMessageReferralRequest = await req.json()

    if (!msgBody) {
      return new Response("Missing body", {
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

    if (msgBody.length > 4000) {
      return new Response("Message too long", {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      })
    }

    // Function code here ...

    const {
      data: { user },
    } = await client.auth.getUser(jwt)

    const { data: sender, error } = await server
      .from("user")
      .select("uuid,username, status")
      .eq("uuid", user.id)
      .single()

    if (sender.status !== "active") {
      return new Response("Not allowed to contact", {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      })
    }

    const { data: receiver } = await server
      .from("user")
      .select(
        "uuid, email,username, is_referer ,is_referee,contact_request_count ",
      )
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

    if (!receiver.is_referee && !receiver.is_referer) {
      return new Response("Not allowed to contact this user", {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      })
    }

    if (sender.uuid === receiver.uuid) {
      return new Response("Same user", {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      })
    }

    // prevent_duplicate_conversation to make sure one conversation for two user
    const { data: conversation } = await server.rpc("find_conversation", {
      user1_uuid: sender.uuid,
      user2_uuid: receiver.uuid,
    })

    let conversationUuid
    let messageUuid

    if (!conversation[0]) {
      const { data: insertConversationRes, error: insertConversationError } =
        await server
          .from("conversation")
          .insert({ sender_uuid: sender.uuid, receiver_uuid: receiver.uuid })
          .select()
          .single()
      conversationUuid = insertConversationRes.uuid

      const { data: insertMessageRes, error: insertMessageError } = await server
        .from("message")
        .insert({
          sender_uuid: sender.uuid,
          conversation_uuid: insertConversationRes.uuid,
          body: msgBody,
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
        `Created conversation uuid:${insertConversationRes.uuid} for ${sender.uuid} and ${receiver.uuid}`,
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
          body: msgBody,
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
        `Existing conversation uuid:${data.uuid} for ${sender.uuid} and ${receiver.uuid}. Inserting message: uuid${message.uuid}`,
      )
    }

    const { data: record } = await server
      .from("referral_contact_history")
      .insert({
        sender_uuid: sender.uuid,
        receiver_uuid: receiver.uuid,
        type,
        message_uuid: messageUuid,
      })

    const { data: updateReceiverCount } = await server
      .from("user")
      .update({ contact_request_count: receiver.contact_request_count + 1 })
      .eq("uuid", to_uuid)
      .single()

    const subject = `${sender.username} sent you a message | Referalah`
    const emailBody = `
        <html>
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Message Notification</title>
      </head>

    <body style="font-family: 'Arial', sans-serif; background-color: #f8f8f8; margin: 0; padding: 20px; text-align: center;">

        <p style="margin: 8px 0; font-size: 16px; color: #333;">Hi ${receiver.username}!</p>
        <p style="margin: 8px 0; font-size: 16px; color: #333;">${sender.username} sent you a message.</p>
        <p style="margin: 8px 0; font-size: 16px; color: #333;">${sender.username}'s profile: <a href="${WEB_BASE_URL}/en-ca/profile/${sender.uuid}" style="color: #007bff; text-decoration: none; font-weight: bold;">${WEB_BASE_URL}/en-ca/profile/${sender.uuid}</a></p>
        <p style="margin: 8px 0; font-size: 16px; color: #333;">Please click the link below to continue the conversation:</p>
        <a href="${WEB_BASE_URL}/en-ca/chat?conversation=${conversationUuid}" style="color: #007bff; text-decoration: none; font-weight: bold;">${WEB_BASE_URL}/en-ca/chat?conversation=${conversationUuid}</a>

        <div style="display: flex; justify-content: center; margin-top: 20px;">
            <div style="background-color: #eee; padding: 16px; border-radius: 8px; max-width: 600px; width: 100%; word-wrap: break-word; white-space: pre-wrap;">
                <p>${msgBody}</p>
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
        to: ENV_IS_LOCAL ? Deno.env.get("RESEND_TO_EMAIL") : receiver.email,
        subject: subject,
        html: emailBody,
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
