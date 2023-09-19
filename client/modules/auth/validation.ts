import { z } from "zod"

export const authFormSchema = z.object({
  email: z.string().email("唔係Email 格式喎😂").nonempty("俾個Email嚟先？"),
})
