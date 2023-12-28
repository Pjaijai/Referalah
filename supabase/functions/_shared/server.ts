import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const initSupabaseServer = () => {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",

    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  )
}

export { initSupabaseServer }
