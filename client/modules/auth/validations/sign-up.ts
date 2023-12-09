import { authEmailValidationSchema } from "@/modules/auth/validations/email"
import { authPasswordValidationSchema } from "@/modules/auth/validations/password"
import { z } from "zod"

export const signUpFormSchema = z
  .object({
    email: authEmailValidationSchema,
    username: z
      .string()
      .min(1, { message: "至少有要1粒字" })
      .max(20, { message: "俾盡20粒字，唔夠用請聯絡我🙏🏻" })
      .nonempty("不如俾個用戶名稱嚟？")
      .refine((value) => !/\s/.test(value), {
        message: "唔可以有空白字元",
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
        message: "請了解下🙇🏻‍♂️",
      }
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "同密碼唔對喎😂",
    path: ["confirmPassword"],
  })
