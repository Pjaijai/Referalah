import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "@/types/supabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClientComponentClient<Database>({
  supabaseUrl,
  supabaseKey,
})

export { supabase }
