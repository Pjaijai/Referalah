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
    const {
      type,
      body: msgBody,
      to_uuid,
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
    } = await client.auth.getUser()

    const { data: sender, error } = await server
      .from("user")
      .select("uuid,username")
      .eq("uuid", user.id)
      .single()

    const { data: receiver } = await server
      .from("user")
      .select("uuid, email,username, is_referer ,is_referee")
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
      return new Response("Receiver is not referrer", {
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

    // prevent_duplicate_conversation to make sure one conversation for two user
    const { data: conversation } = await server.rpc("find_conversation", {
      user1_uuid: sender.uuid,
      user2_uuid: receiver.uuid,
    })

    let conversationUuid

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
        })
        .select()
        .single()

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

      conversationUuid = conversation.uuid
      const { data: message } = await server
        .from("message")
        .insert({
          sender_uuid: sender.uuid,
          conversation_uuid: conversation[0].uuid,
          body: msgBody,
        })
        .select()
        .single()

      const { data, error } = await server
        .from("conversation")
        .update({ last_message_uuid: message.uuid })
        .eq("uuid", conversation[0].uuid)

      console.log(
        `Existing conversation uuid:${data.uuid} for ${sender.uuid} and ${receiver.uuid}. Inserting message: uuid${message.uuid}`,
      )
    }

    const subject = `${sender.username} sent you a message.`
    const emailBody = `
      <html>
      <body>
          <p>Hi ${receiver.username}!</p>
          <p>${sender.username} sent you a message.</p>
          <p>${sender.username}'s profile: <a href="${WEB_BASE_URL}en-ca/profile/${sender.uuid}">${WEB_BASE_URL}/en-ca/profile/${sender.uuid}</a></p>
          <p>Please click the link below to continue the conversation:</p>
         <a href="${WEB_BASE_URL}en-ca/chat/${conversationUuid}">${WEB_BASE_URL}/en-ca/chat/${conversationUuid}</a>
         
         <div class='w-full flex justify-center'>
         <div class="w-fit">
                 <div class="bg-[#eee] p-4 word-break: break-word; white-space: pre-wrap; rounded-lg max-w-screen-lg">
                     <p class="mt-2">  ${msgBody}</p>
                 </div>
       </div >
       </div >
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
