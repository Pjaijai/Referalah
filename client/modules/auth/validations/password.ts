import { z } from "zod"

export const authPasswordValidationSchema = z
  .string()
  .min(6, { message: "最少6粒字" })
  .max(20, { message: "最多20粒字" })
