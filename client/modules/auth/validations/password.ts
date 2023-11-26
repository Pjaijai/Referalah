import { z } from "zod"

export const authPasswordValidationSchema = z
  .string()
  .min(6, { message: "too short" })
  .max(20, { message: "too long" })
