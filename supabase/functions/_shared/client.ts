import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const initSupabaseClient = (req: any) => {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",

    Deno.env.get("SUPABASE_ANON_KEY") ?? "",

    {
      auth: { persistSession: false },
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    },
  )
}

export { initSupabaseClient }
