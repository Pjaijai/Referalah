import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const initSupabaseClient = (req: any) => {
  return createClient(
    // Supabase API URL - env var exported by default.
    Deno.env.get("SUPABASE_URL") ?? "",
    // Supabase API ANON KEY - env var exported by default.
    // Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    // Create client with Auth context of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    {
      auth: { persistSession: false },
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    },
  )
}

export { initSupabaseClient }
