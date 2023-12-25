import { authEmailValidationSchema } from "@/modules/auth/validations/email"
import { authPasswordValidationSchema } from "@/modules/auth/validations/password"
import { z } from "zod"

export const passwordSignInFormSchema = z.object({
  email: authEmailValidationSchema,
  password: authPasswordValidationSchema,
})
