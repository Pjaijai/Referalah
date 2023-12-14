import { authEmailValidationSchema } from "@/modules/auth/validations/email"
import { authPasswordValidationSchema } from "@/modules/auth/validations/password"
import { z } from "zod"

export const resetPasswordFormSchema = z
  .object({
    email: authEmailValidationSchema,
    password: authPasswordValidationSchema,
    confirmPassword: authPasswordValidationSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "同密碼唔對喎😂",
    path: ["confirmPassword"],
  })
