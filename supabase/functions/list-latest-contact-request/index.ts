import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { initSupabaseServer } from "../_shared/server.ts"

serve(async () => {
  try {
    const server = initSupabaseServer()

    const { data: postContactList } = await server
      .from("post_contact_history")
      .select(
        `
        id,
        uuid,
      sender_uuid(
        username
      ),
      post_uuid(
        uuid,
        job_title
      ),
      created_at
      `,
      )
      .order("created_at", { ascending: false })
      .limit(10)

    const newPostList = postContactList.map((post) => {
      return {
        type: "post",
        createdAt: post.created_at,
        postUuid: post.uuid,
        senderUserName: post.sender_uuid.username,
        postJobTitle: post.post_uuid.job_title,
      }
    })

    const { data: memberContactList } = await server
      .from("referral_contact_history")
      .select(
        `
      id,
      uuid,
    sender_uuid(
      username
    ),
    receiver_uuid(
      username,
      uuid
    ),
    created_at
      `,
      )
      .order("created_at", { ascending: false })
      .limit(10)

    const newMemberList = memberContactList.map((member) => {
      return {
        type: "member",
        createdAt: member.created_at,
        receiverUserName: member.receiver_uuid.username,
        receiverUuid: member.receiver_uuid.uuid,
        senderUserName: member.sender_uuid.username,
      }
    })

    const res = [...newPostList, ...newMemberList]
    const sortedRes = res.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    return new Response(JSON.stringify(sortedRes), {
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
