import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

import { initSupabaseClient } from "../_shared/client.ts"
import { corsHeaders, ENV_IS_LOCAL } from "../_shared/cors.ts"
import { EPostStatus } from "../_shared/types/enums/post/status.ts"
import { initSupabaseServer } from "../_shared/server.ts"
import { IMessagePostCreatorRequest } from "../_shared/types/request/message-post-creator.ts"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
const WEB_BASE_URL = Deno.env.get("WEB_BASE_URL")

serve(async (req: any) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  const client = initSupabaseClient(req)
  const server = initSupabaseServer()
  const { post_uuid, body: msgBody }: IMessagePostCreatorRequest =
    await req.json()

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
  try {
    const {
      data: { user },
    } = await client.auth.getUser()

    const { data: sender, error } = await server
      .from("user")
      .select("uuid,username, email")
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
              uuid
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
        })
        .select()
        .single()

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
        })
        .select()
        .single()

      const { data, error } = await server
        .from("conversation")
        .update({ last_message_uuid: message.uuid })
        .eq("uuid", conversation[0].uuid)
        .select()
        .single()

      console.log(
        `Existing conversation uuid:${data.uuid} for ${sender.uuid} and ${post.user.uuid}. Inserting message: uuid${message.uuid}`,
      )
    }

    const subject = `${sender.username} is interested in you post - ${post.job_title}`
    const body = `
            <html>
            <body>
                <p>Hi ${post.user.username}!</p>
                <p>${sender.username} sent you a message about your post: ${post.job_title}</p>
                <p>Post's link:<a href="${WEB_BASE_URL}/en-ca/post/referer/${post.uuid}">${WEB_BASE_URL}/en-ca/post/referer/${post.uuid}</a></p>
                <p>Job Title: ${post.job_title}</p>
                <p>Company: ${post.company_name}</p>
                <p>${sender.username}'s profile: <a href="${WEB_BASE_URL}/en-ca/profile/${sender.uuid}">${WEB_BASE_URL}/profile/en-ca/${sender.uuid}</a></p>
                <p>Please click the link below to continue the conversation:</p>
                <a href="${WEB_BASE_URL}en-ca/chat?conversation=${conversationUuid}">${WEB_BASE_URL}/en-ca/chat?conversation=${conversationUuid}</a>
                
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
