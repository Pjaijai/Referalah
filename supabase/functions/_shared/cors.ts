import "https://deno.land/std@0.177.0/dotenv/load.ts";

enum environment {
  PRODUCTION = "PRODUCTION",
  STAGING = "STAGING",
}

export const ENV_IS_PRODUCTION = Deno.env.get("ENVIRONMENT") === environment.PRODUCTION;
export const ENV_IS_STAGING = Deno.env.get("ENVIRONMENT") === environment.STAGING;
export const ENV_IS_LOCAL = !ENV_IS_PRODUCTION && !ENV_IS_STAGING;

export const corsHeaders = {
  "Access-Control-Allow-Origin": ENV_IS_PRODUCTION ? Deno.env.get("WEB_BASE_URL") : "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
