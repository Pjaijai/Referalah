import { z } from "zod"

export const authPasswordValidationSchema = z
  .string()
  .min(8, { message: "最少8粒字" })
  .max(20, { message: "最多20粒字" })
