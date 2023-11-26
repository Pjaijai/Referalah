import { authEmailValidationSchema } from "@/modules/auth/validations/email"
import { authPasswordValidationSchema } from "@/modules/auth/validations/password"
import { z } from "zod"

export const signUpFormSchema = z
  .object({
    email: authEmailValidationSchema,
    username: z
      .string()
      .min(1, { message: "too short" })
      .max(12, { message: "too long" })
      .nonempty("俾個Email嚟先？")
      .refine((value) => !/\s/.test(value), {
        message: "Whitespace is not allowed in the username.",
      }),
    password: authPasswordValidationSchema,
    confirmPassword: authPasswordValidationSchema,
    privacyPolicy: z.boolean().refine(
      (value) => {
        if (!value) {
          return false
        }
        return true
      },
      {
        message: "Password doesn't match",
      }
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
