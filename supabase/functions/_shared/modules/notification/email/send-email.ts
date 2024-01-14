import { ENV_IS_LOCAL } from "../../../cors.ts"
import { TSendEmailRequest } from "../../../types/request/notification/email/send-email.ts"
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
export const sendEmail = async (req: TSendEmailRequest) => {
  const { body, subject, to } = req

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: ENV_IS_LOCAL
          ? "onboarding@resend.dev"
          : "Referalah <team@referalah.com>",
        to: ENV_IS_LOCAL ? Deno.env.get("RESEND_TO_EMAIL") : to,
        subject: subject,
        html: body,
      }),
    })
    return res
  } catch (error) {
    console.error(error)
  }
}
