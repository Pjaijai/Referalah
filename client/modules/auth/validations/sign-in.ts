import { authEmailValidationSchema } from "@/modules/auth/validations/email"
import { authPasswordValidationSchema } from "@/modules/auth/validations/password"
import { z } from "zod"

export const signInFormSchema = z.object({
  email: authEmailValidationSchema,
  password: authPasswordValidationSchema,
})
