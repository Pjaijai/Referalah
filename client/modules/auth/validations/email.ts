import { z } from "zod"

export const authEmailValidationSchema = z
  .string()
  .email("唔係Email 格式喎😂")
  .nonempty("俾個Email嚟先？")
