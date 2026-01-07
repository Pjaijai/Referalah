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
        postUuid: post.post_uuid.uuid,
        senderUserName: post.sender_uuid.username,
        postJobTitle: post.post_uuid.job_title,
      }
    })

    return new Response(JSON.stringify(newPostList), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    })
  }
})
