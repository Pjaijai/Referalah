import { NextRequest } from "next/server"
import { i18nMiddleware } from "@/middlewares/i18n"
import { supabaseMiddleware } from "@/middlewares/supabase"

export async function middleware(req: NextRequest) {
  await supabaseMiddleware(req)
  return i18nMiddleware(req)
}

export const config = {
  matcher: [
    "/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
