import { z } from "zod"

export const signUpFormSchema = z
  .object({
    email: z.string().email("唔係Email 格式喎😂").nonempty("俾個Email嚟先？"),
    username: z
      .string()
      .min(1, { message: "too short" })
      .max(12, { message: "too long" })
      .nonempty("俾個Email嚟先？")
      .refine((value) => !/\s/.test(value), {
        message: "Whitespace is not allowed in the username.",
      }),
    password: z
      .string()
      .min(6, { message: "too short" })
      .max(20, { message: "too long" }),
    confirmPassword: z.string(),
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
