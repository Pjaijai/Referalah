import "https://deno.land/std@0.177.0/dotenv/load.ts";

enum stagingEnvironment {
  PRODUCTION = "PRODUCTION",
  STAGING = "STAGING",
}

export const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("ENVIRONMENT") === stagingEnvironment.PRODUCTION ? Deno.env.get("WEB_BASE_URL") : "*" ,
  "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
}
