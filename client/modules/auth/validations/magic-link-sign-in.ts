import { authEmailValidationSchema } from "@/modules/auth/validations/email"
import { z } from "zod"

export const magicLinkSignInFormSchema = z.object({
  email: authEmailValidationSchema,
})
