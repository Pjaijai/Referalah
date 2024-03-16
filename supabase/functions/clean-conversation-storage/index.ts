// local api url ip address is : 172.17.0.1
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { initSupabaseServer } from "../_shared/server.ts"

serve(async (req: any) => {
  try {
    console.log("Clean conversation storage at :", new Date().toISOString())

    const server = initSupabaseServer()

    const { key } = await req.json()
    if (!key) {
      return new Response("Give me the key", {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      })
    }

    const { data: cron_key } = await server
      .from("config")
      .select("*")
      .eq("name", "cron_key")
      .single()

    if (key !== cron_key.value)
      return new Response("Invalid Key", {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      })

    const date = new Date()
    date.setDate(date.getDate() - 7)

    const { data, error } = await server
      .from("message")
      .select("*")
      .not("document", "is", null)
      .lte("created_at", date.toISOString())

    const paths = data.map((d) => d.document.internalPath)

    const { data: removeRes } = await server.storage
      .from("conversation_documents")
      .remove(paths)

    return new Response(JSON.stringify(removeRes), {
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
