import { authEmailValidationSchema } from "@/modules/auth/validations/email"
import { z } from "zod"

export const forgotPasswordFormSchema = z.object({
  email: authEmailValidationSchema,
})
